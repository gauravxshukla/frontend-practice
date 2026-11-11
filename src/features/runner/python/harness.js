// JS side of the Python runner: loads prelude.py into a Pyodide instance and
// turns its JSON results into ExecResults. Shared by the browser worker
// (pyWorker.js) and scripts/verify-python.test.js so both run identical code.

/** @typedef {import('../languages/types').ExecResult} ExecResult */

/** Python's [[level, line], ...] stdout into console LogEntries. */
function toLogs(stdout) {
  return stdout.map(([level, line], i) => ({ id: String(i), level, args: [{ t: 'text', v: line }], count: 1 }));
}

/**
 * @param {{ runPython(code: string): unknown; globals: { get(name: string): (...args: string[]) => string } }} pyodide
 * @param {string} preludeSource contents of prelude.py
 * @returns {(code: string, spec: object, cases: object[]) => ExecResult}
 */
export function createPythonRunner(pyodide, preludeSource) {
  pyodide.runPython(preludeSource);
  const run = pyodide.globals.get('_fp_run');
  return (code, spec, cases) => {
    const result = JSON.parse(run(code, JSON.stringify(spec), JSON.stringify(cases)));
    if (result.type !== 'outputs') return result;
    return {
      type: 'outputs',
      runtimeMs: result.runtimeMs,
      outputs: result.outputs.map(({ index, output, error, stdout }) => ({
        index,
        ...(error ? { error } : { output }),
        logs: toLogs(stdout),
      })),
    };
  };
}
