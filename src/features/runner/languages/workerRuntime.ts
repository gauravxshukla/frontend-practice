import { runJob, type RunResponse } from '../runJob';
import type { DsaRunInput, ExecResult, LanguageId, LanguageRuntime, RuntimeStatus } from './types';

/** Budget for the JS judge step (it may run the JS reference for custom testcases). */
const JUDGE_LIMIT_MS = 3000;

type WorkerReply =
  | { type: 'ready' }
  | { type: 'init-error'; message: string }
  | { type: 'compiled' }
  | { type: 'exec-result'; result: unknown; fatal?: boolean };

export interface WorkerRuntimeOptions {
  id: LanguageId;
  createWorker: () => Worker;
  /** First message to the worker (it loads its runtime, then replies `ready`). */
  initMessage: () => Promise<Record<string, unknown>>;
  /** The message that runs one job. */
  execMessage: (input: DsaRunInput) => Promise<Record<string, unknown>>;
  /** The worker's raw result as an ExecResult. */
  toResult?: (raw: unknown) => ExecResult;
  /**
   * Compiled languages: budget for compiling. The run limit only starts once the
   * worker reports `compiled`, so a slow first compile never reads as a TLE.
   */
  compileLimitMs?: number;
}

/**
 * A language runtime living in one long-lived worker (Pyodide, CheerpJ), shared
 * by every question so it downloads and boots once per page. A run that exceeds
 * its limit can't be interrupted (that needs cross-origin isolation, which would
 * break Sandpack's iframe), so the worker is terminated and a fresh one boots in
 * the background. Outputs are judged in JS by the same core as every language.
 */
export class WorkerRuntime implements LanguageRuntime {
  readonly id: LanguageId;
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private state: RuntimeStatus = 'cold';
  private lastError: string | undefined;
  private listeners = new Set<() => void>();

  constructor(private readonly options: WorkerRuntimeOptions) {
    this.id = options.id;
  }

  status = () => this.state;
  error = () => this.lastError;

  subscribe = (onChange: () => void) => {
    this.listeners.add(onChange);
    return () => this.listeners.delete(onChange);
  };

  private set(state: RuntimeStatus) {
    this.state = state;
    this.listeners.forEach((l) => l());
  }

  private kill() {
    this.worker?.terminate();
    this.worker = null;
    this.ready = null;
  }

  /** After a timeout or crash: boot a fresh worker without making anyone wait for it. */
  private restart() {
    this.kill();
    this.set('restarting');
    this.warmUp().catch(() => {});
  }

  warmUp = (): Promise<void> => {
    if (this.ready) return this.ready;
    this.lastError = undefined;
    if (this.state !== 'restarting') this.set('loading');
    const worker = this.options.createWorker();
    this.worker = worker;
    this.ready = new Promise<void>((resolve, reject) => {
      const fail = (message: string) => {
        if (this.worker !== worker) return;
        this.kill();
        this.lastError = message;
        this.set('error');
        reject(new Error(message));
      };
      worker.onmessage = ({ data }: MessageEvent<WorkerReply>) => {
        if (data.type === 'ready') {
          this.set('ready');
          resolve();
        } else if (data.type === 'init-error') {
          fail(data.message);
        }
      };
      worker.onerror = (event) => fail(event.message || `The ${this.id} runtime failed to start.`);
      this.options
        .initMessage()
        .then((message) => worker.postMessage(message))
        .catch((error: Error) => fail(error.message));
    });
    return this.ready;
  };

  private exec(message: Record<string, unknown>, limitMs: number): Promise<ExecResult> {
    const worker = this.worker;
    if (!worker) return Promise.resolve({ type: 'internal-error', message: `The ${this.id} runtime is not running.` });
    const { compileLimitMs, toResult = (raw) => raw as ExecResult } = this.options;
    return new Promise((resolve) => {
      let timer: ReturnType<typeof setTimeout>;
      // Starts only once the runtime is ready, so the first download never counts as TLE.
      const arm = (ms: number, onExpire: () => ExecResult) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.restart();
          resolve(onExpire());
        }, ms);
      };
      if (compileLimitMs) {
        arm(compileLimitMs, () => ({
          type: 'internal-error',
          message: `Compiling took longer than ${compileLimitMs / 1000}s and was stopped.`,
        }));
      } else {
        arm(limitMs, () => ({ type: 'timeout', limitMs }));
      }
      worker.onmessage = ({ data }: MessageEvent<WorkerReply>) => {
        if (data.type === 'compiled') {
          arm(limitMs, () => ({ type: 'timeout', limitMs }));
          return;
        }
        if (data.type !== 'exec-result') return;
        clearTimeout(timer);
        if (data.fatal) this.restart();
        resolve(toResult(data.result));
      };
      worker.onerror = (event) => {
        clearTimeout(timer);
        this.restart();
        resolve({ type: 'internal-error', message: event.message || `The ${this.id} runtime crashed.` });
      };
      worker.postMessage(message);
    });
  }

  run = async (input: DsaRunInput, limitMs: number): Promise<RunResponse> => {
    try {
      await this.warmUp();
    } catch (error) {
      return { type: 'internal-error', message: `Couldn't load the ${this.id} runtime: ${(error as Error).message}` };
    }
    const result = await this.exec(await this.options.execMessage(input), limitMs);
    if (result.type !== 'outputs') return result;
    const { spec, cases, refCode, checkerCode } = input;
    return runJob(
      { type: 'dsa-judge', spec, cases, outputs: result.outputs, runtimeMs: result.runtimeMs, refCode, checkerCode },
      JUDGE_LIMIT_MS,
    );
  };

  /** Stops the worker; the next run boots a new one. */
  dispose = () => {
    this.kill();
    this.set('cold');
  };
}
