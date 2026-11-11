// Runs Python through the exact harness the browser uses (prelude.py +
// harness.js on Pyodide) and judges it with the shared core:
// - every solution.py passes every case;
// - every question's Python starter (generated, or a committed starter.py)
//   runs without harness errors and fails at least one case;
// - errors, prints and custom testcases come back the way the UI expects.
import { existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadPyodide } from 'pyodide';
import { gradeOutputs } from '../src/features/runner/core.js';
import { createPythonRunner } from '../src/features/runner/python/harness.js';
import { pythonStub } from '../src/features/runner/stubs/pythonStub.ts';

const only = process.env.DSA_ONLY; // e.g. DSA_ONLY=content/dsa/trees
const specFiles = globSync('content/dsa/**/cases.json').filter((f) => !only || f.startsWith(only)).sort();
const prelude = readFileSync('src/features/runner/python/prelude.py', 'utf8');
const runPython = createPythonRunner(await loadPyodide(), prelude);

const read = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : undefined);
const load = async (path) => (existsSync(path) ? import(pathToFileURL(resolve(path)).href) : null);

/** Runs Python and judges it like the browser's dsa-judge job. */
async function judgePython(dir, spec, code, cases = spec.cases) {
  const exec = runPython(code, spec, cases);
  if (exec.type !== 'outputs') return { exec, results: [] };
  const reference = (await load(join(dir, 'solution.js')))?.default;
  const checker = (await load(join(dir, 'checker.js')))?.default;
  return { exec, results: await gradeOutputs({ spec, cases, outputs: exec.outputs, reference, checker }) };
}

describe.each(specFiles)('%s', (specFile) => {
  const dir = dirname(specFile);
  const spec = JSON.parse(readFileSync(specFile, 'utf8'));
  const solution = read(join(dir, 'solution.py'));

  test.runIf(solution)('solution.py passes every case', async () => {
    const { exec, results } = await judgePython(dir, spec, solution);
    expect(exec.type, JSON.stringify(exec)).toBe('outputs');
    for (const r of results) {
      expect(r.passed, `case ${r.index + 1}: output ${r.output} expected ${r.expected} ${r.error?.message ?? ''}`).toBe(true);
    }
  });

  test('Python starter runs cleanly and fails at least one case', async () => {
    const starter = read(join(dir, 'starter.py')) ?? pythonStub(spec, read(join(dir, 'starter.js')));
    const { exec, results } = await judgePython(dir, spec, starter);
    // A harness or compile error here means the stub or an input adapter is broken.
    expect(exec.type, JSON.stringify(exec)).toBe('outputs');
    expect(results.some((r) => r.passed === false)).toBe(true);
  });
});

describe('python runner behaviour', () => {
  const dir = 'content/dsa/arrays-hashing/two-sum';
  const spec = JSON.parse(readFileSync(join(dir, 'cases.json'), 'utf8'));
  const twoCases = spec.cases.slice(0, 2);

  it('reports a SyntaxError as a compile error with its line', () => {
    const exec = runPython('class Solution:\n    def twoSum(self, nums, target)\n        pass\n', spec, twoCases);
    expect(exec.type).toBe('compile-error');
    expect(exec.message).toMatch(/^SyntaxError: .*\(line 2\)$/);
  });

  it('reports IndentationError as a compile error too', () => {
    const exec = runPython('class Solution:\ndef twoSum(self, nums, target):\n    pass\n', spec, twoCases);
    expect(exec).toMatchObject({ type: 'compile-error', message: expect.stringMatching(/^SyntaxError: IndentationError/) });
  });

  it('points a runtime error at the line in the user file', () => {
    const code = 'class Solution:\n    def twoSum(self, nums, target):\n        x = 1\n        return nums[99]\n';
    const exec = runPython(code, spec, twoCases);
    expect(exec.outputs[0].error).toEqual({ message: 'IndexError: list index out of range', line: 4 });
  });

  it('captures print and stderr per testcase, as log entries', () => {
    const code =
      'import sys\nclass Solution:\n    def twoSum(self, nums, target):\n        print("nums", nums)\n        print("warn", file=sys.stderr)\n        return [0, 1]\n';
    const exec = runPython(code, spec, twoCases);
    expect(exec.outputs[0].logs.map((l) => [l.level, l.args[0].v])).toEqual([
      ['log', 'nums [2, 7, 11, 15]'],
      ['error', 'warn'],
    ]);
    expect(exec.outputs[1].logs[0].args[0].v).toBe('nums [3, 2, 4]');
  });

  it('caps runaway printing', () => {
    const code = 'class Solution:\n    def twoSum(self, nums, target):\n        for i in range(5000): print(i)\n        return [0, 1]\n';
    const logs = runPython(code, spec, twoCases.slice(0, 1)).outputs[0].logs;
    expect(logs).toHaveLength(201);
    expect(logs.at(-1)).toMatchObject({ level: 'warn', args: [{ v: '… 4800 more lines truncated' }] });
  });

  it('explains a missing Solution class, and treats exit() as the user’s error', () => {
    expect(runPython('x = 1\n', spec, twoCases).outputs[0].error.message).toMatch(/Define class Solution with a method twoSum/);
    const exited = runPython('class Solution:\n    def twoSum(self, nums, target):\n        exit()\n', spec, twoCases);
    expect(exited.outputs[0].error.message).toMatch(/^SystemExit/);
  });

  it('judges a custom testcase against the JS reference', async () => {
    const custom = [{ input: [[5, 1, 4], 9] }]; // no expected value
    const { results } = await judgePython(dir, spec, read(join(dir, 'solution.py')), custom);
    expect(results[0]).toMatchObject({ passed: true, expected: '[0,2]' });
  });

  it('keeps user globals isolated between runs', () => {
    runPython('LEAK = 1\nclass Solution:\n    def twoSum(self, nums, target): return [0, 1]\n', spec, twoCases);
    const exec = runPython('class Solution:\n    def twoSum(self, nums, target): return [LEAK, 1]\n', spec, twoCases);
    expect(exec.outputs[0].error.message).toMatch(/^NameError/);
  });
});
