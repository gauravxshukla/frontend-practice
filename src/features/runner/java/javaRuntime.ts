import { WorkerRuntime } from '../languages/workerRuntime';
import type { ExecResult } from '../languages/types';
import { CHEERPJ_JAVA_VERSION, CHEERPJ_LOADER_URL } from './config';
import { cleanCompilerOutput, jobJson, prepareJavaRun } from './prepare.js';

const loadSources = () => import('./sources');

/** What FpHarness / the worker report, before stdout becomes log entries. */
type RawResult =
  | { type: 'outputs'; outputs: { index: number; output?: unknown; error?: { message: string; line: number | null }; stdout: [string, string][] }[]; runtimeMs: number }
  | { type: 'compile-error'; message: string }
  | { type: 'internal-error'; message: string };

const LEVELS = new Set(['log', 'info', 'warn', 'error', 'debug']);

function toResult(raw: unknown): ExecResult {
  const result = raw as RawResult;
  if (result.type === 'compile-error') {
    // javac errors are compile errors whatever the message says (unlike JS/Python's SyntaxError check).
    return { type: 'compile-error', kind: 'compile', message: cleanCompilerOutput(result.message) };
  }
  if (result.type !== 'outputs') return result;
  return {
    type: 'outputs',
    runtimeMs: result.runtimeMs,
    outputs: result.outputs.map(({ index, output, error, stdout }) => ({
      index,
      ...(error ? { error } : { output }),
      logs: stdout.map(([level, line], i) => ({
        id: String(i),
        level: LEVELS.has(level) ? (level as 'log') : 'log',
        args: [{ t: 'text' as const, v: line }],
        count: 1,
      })),
    })),
  };
}

let runs = 0;

/** Java (CheerpJ) in a long-lived worker; see javaWorker.js and harness/FpHarness.java. */
export const javaRuntime = new WorkerRuntime({
  id: 'java',
  // Classic worker: CheerpJ's loader is a plain script for importScripts.
  createWorker: () => new Worker(new URL('./javaWorker.js', import.meta.url)),
  initMessage: async () => {
    const { HARNESS_SOURCES, harnessHash } = await loadSources();
    return {
      type: 'init',
      loaderUrl: CHEERPJ_LOADER_URL,
      javaVersion: CHEERPJ_JAVA_VERSION,
      harness: HARNESS_SOURCES,
      hash: harnessHash(),
    };
  },
  execMessage: async ({ code, spec, cases }) => {
    const { NODE_SOURCES } = await loadSources();
    return {
      type: 'exec',
      files: prepareJavaRun(code, spec, NODE_SOURCES),
      job: jobJson(spec, cases),
      // Unique per run: classes go to a fresh directory on CheerpJ's persistent disk.
      runId: `${Date.now().toString(36)}${(runs++).toString(36)}`,
    };
  },
  toResult,
  compileLimitMs: 30000,
});

if (typeof window !== 'undefined') window.addEventListener('pagehide', javaRuntime.dispose);
