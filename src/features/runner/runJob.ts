import type { DsaCase, DsaSpec } from '../../lib/content/catalog';

export interface CaseResult {
  index: number;
  /** DSA: per-parameter display values. */
  input?: { name: string; value: string }[];
  /** JS: test name. */
  name?: string;
  hidden?: boolean;
  output?: string;
  expected?: string;
  /** null = no expected value to compare against (custom case, no reference). */
  passed: boolean | null;
  stdout: string[];
  /** JS: assertion message when an expectation failed. */
  failure?: string;
  error?: { message: string; line: number | null };
}

export type RunResponse =
  | { type: 'done'; results: CaseResult[]; runtimeMs: number }
  | { type: 'collected'; names: string[] }
  | { type: 'compile-error'; message: string }
  | { type: 'timeout'; limitMs: number }
  | { type: 'internal-error'; message: string };

export type RunJob =
  | { type: 'dsa'; userCode: string; refCode?: string; checkerCode?: string; spec: DsaSpec; cases: DsaCase[] }
  | { type: 'jest'; userCode: string; testCode: string; env?: 'dom'; only?: string[] }
  | { type: 'jest-collect'; userCode: string; testCode: string; env?: 'dom' };

/**
 * Runs a job in a fresh module worker and terminates it after `limitMs`.
 * A fresh worker per run also isolates prototype patches (polyfill questions).
 */
export function runJob(job: RunJob, limitMs: number): Promise<RunResponse> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ type: 'timeout', limitMs });
    }, limitMs);

    worker.onmessage = (event: MessageEvent<RunResponse>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(event.data);
    };
    worker.onerror = (event) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ type: 'internal-error', message: event.message || 'The runner crashed.' });
    };
    worker.postMessage(job);
  });
}
