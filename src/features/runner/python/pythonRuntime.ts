import type { DsaCase, DsaSpec } from '../../../lib/content/catalog';
import { runJob, type RunResponse } from '../runJob';
import type { DsaRunInput, ExecResult, LanguageRuntime, RuntimeStatus } from '../languages/types';

/** Budget for the JS judge step (it may run the JS reference for custom testcases). */
const JUDGE_LIMIT_MS = 3000;

type WorkerReply =
  | { type: 'ready' }
  | { type: 'init-error'; message: string }
  | { type: 'exec-result'; result: ExecResult; fatal?: boolean };

/**
 * One long-lived Pyodide worker shared by every question, so the ~6 MB runtime
 * downloads and boots once per page. A run that exceeds its limit can't be
 * interrupted (that needs cross-origin isolation, which would break Sandpack's
 * iframe), so the worker is terminated and a fresh one boots in the background.
 */
class PythonRuntime implements LanguageRuntime {
  readonly id = 'python' as const;
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private state: RuntimeStatus = 'cold';
  private lastError: string | undefined;
  private listeners = new Set<() => void>();

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
    const worker = new Worker(new URL('./pyWorker.js', import.meta.url), { type: 'module' });
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
      worker.onerror = (event) => fail(event.message || 'The Python runtime failed to start.');
      worker.postMessage({ type: 'init' });
    });
    return this.ready;
  };

  private exec(code: string, spec: DsaSpec, cases: DsaCase[], limitMs: number): Promise<ExecResult> {
    const worker = this.worker;
    if (!worker) return Promise.resolve({ type: 'internal-error', message: 'The Python runtime is not running.' });
    return new Promise((resolve) => {
      // Starts only once the runtime is ready, so the first download never counts as TLE.
      const timer = setTimeout(() => {
        this.restart();
        resolve({ type: 'timeout', limitMs });
      }, limitMs);
      worker.onmessage = ({ data }: MessageEvent<WorkerReply>) => {
        if (data.type !== 'exec-result') return;
        clearTimeout(timer);
        if (data.fatal) this.restart();
        resolve(data.result);
      };
      worker.onerror = (event) => {
        clearTimeout(timer);
        this.restart();
        resolve({ type: 'internal-error', message: event.message || 'The Python runtime crashed.' });
      };
      worker.postMessage({ type: 'exec', code, spec, cases });
    });
  }

  run = async ({ code, spec, cases, refCode, checkerCode }: DsaRunInput, limitMs: number): Promise<RunResponse> => {
    try {
      await this.warmUp();
    } catch (error) {
      return { type: 'internal-error', message: `Couldn't load the Python runtime: ${(error as Error).message}` };
    }
    const result = await this.exec(code, spec, cases, limitMs);
    if (result.type !== 'outputs') return result;
    // Judge in JS with the same core every language uses.
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

export const pythonRuntime = new PythonRuntime();

// Don't leave a busy interpreter behind when the tab goes away.
if (typeof window !== 'undefined') window.addEventListener('pagehide', pythonRuntime.dispose);
