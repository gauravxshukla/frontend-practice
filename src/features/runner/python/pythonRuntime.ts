import { WorkerRuntime } from '../languages/workerRuntime';

/** CPython (Pyodide) in a long-lived worker; see pyWorker.js and prelude.py. */
export const pythonRuntime = new WorkerRuntime({
  id: 'python',
  createWorker: () => new Worker(new URL('./pyWorker.js', import.meta.url), { type: 'module' }),
  initMessage: async () => ({ type: 'init' }),
  execMessage: async ({ code, spec, cases }) => ({ type: 'exec', code, spec, cases }),
});

// Don't leave a busy interpreter behind when the tab goes away.
if (typeof window !== 'undefined') window.addEventListener('pagehide', pythonRuntime.dispose);
