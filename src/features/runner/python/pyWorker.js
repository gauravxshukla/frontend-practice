// Long-lived Python worker: loads Pyodide once, then runs DSA jobs on request.
// Unlike the JS runner (a fresh worker per run), reloading Pyodide every run
// would cost seconds, so the main thread keeps this alive and only kills it on
// a timeout (see pythonRuntime.ts).
import prelude from './prelude.py?raw';
import { createPythonRunner } from './harness.js';
import { PYODIDE_INDEX_URL } from './config.js';

let runner = null;

async function init() {
  const { loadPyodide } = await import(/* @vite-ignore */ `${PYODIDE_INDEX_URL}pyodide.mjs`);
  const pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });
  runner = createPythonRunner(pyodide, prelude);
}

self.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    try {
      await init();
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'init-error', message: error?.message ?? String(error) });
    }
  } else if (data.type === 'exec') {
    try {
      self.postMessage({ type: 'exec-result', result: runner(data.code, data.spec, data.cases) });
    } catch (error) {
      // Pyodide itself failed (e.g. a fatal wasm error): the runtime restarts this worker.
      self.postMessage({ type: 'exec-result', fatal: true, result: { type: 'internal-error', message: String(error?.message ?? error) } });
    }
  }
};
