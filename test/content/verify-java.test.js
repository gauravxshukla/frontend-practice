// Runs Java through the same harness the browser uses (FpHarness + the files
// prepare.js builds), on a real JDK instead of CheerpJ, judged by the shared core:
// - every solution.java passes every case;
// - every question's Java starter (generated, or a committed starter.java)
//   compiles, runs without harness or type errors, and fails at least one case;
// - errors, prints and line numbers come back the way the UI expects.
// Compiles with --release 11 to match CheerpJ's Java 11. Skipped without a JDK.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, globSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gradeOutputs } from '../../src/features/runner/core.js';
import { cleanCompilerOutput, jobJson, prepareJavaRun } from '../../src/features/runner/java/prepare.js';
import { javaStub } from '../../src/features/runner/stubs/javaStub.ts';

const hasJdk = spawnSync('javac', ['-version']).status === 0;
const only = process.env.DSA_ONLY; // e.g. DSA_ONLY=content/dsa/trees
const specFiles = globSync('content/dsa/**/cases.json').filter((f) => !only || f.startsWith(only)).sort();
const JAVA_DIR = 'src/features/runner/java';
const nodeSources = Object.fromEntries(
  readdirSync(join(JAVA_DIR, 'nodes')).map((f) => [basename(f, '.java'), readFileSync(join(JAVA_DIR, 'nodes', f), 'utf8')]),
);
const root = mkdtempSync(join(tmpdir(), 'fp-java-'));
const harnessDir = join(root, 'harness');

const read = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : undefined);
const load = async (path) => (existsSync(path) ? import(pathToFileURL(resolve(path)).href) : null);

function exec(cmd, args, timeoutMs = 30000) {
  return new Promise((done) => {
    const child = spawn(cmd, args);
    let output = '';
    child.stdout.on('data', (d) => (output += d));
    child.stderr.on('data', (d) => (output += d));
    const timer = setTimeout(() => child.kill('SIGKILL'), timeoutMs);
    child.on('close', (code) => {
      clearTimeout(timer);
      done({ code, output });
    });
  });
}

let runs = 0;
/** Compiles and runs like the browser runtime; returns the harness's raw result. */
async function runJava(code, spec, cases) {
  const dir = join(root, `run-${++runs}`);
  mkdirSync(join(dir, 'src'), { recursive: true });
  const files = prepareJavaRun(code, spec, nodeSources);
  for (const [name, source] of Object.entries(files)) writeFileSync(join(dir, 'src', name), source);
  writeFileSync(join(dir, 'job.json'), jobJson(spec, cases));
  const sources = Object.keys(files).map((f) => join(dir, 'src', f));
  const javac = await exec('javac', ['--release', '11', '-encoding', 'UTF-8', '-g', '-nowarn', '-d', join(dir, 'classes'), ...sources]);
  if (javac.code !== 0) return { type: 'compile-error', message: cleanCompilerOutput(javac.output) };
  const sep = process.platform === 'win32' ? ';' : ':';
  const java = await exec('java', ['-cp', `${harnessDir}${sep}${join(dir, 'classes')}`, 'FpHarness', join(dir, 'job.json'), join(dir, 'result.json')]);
  const result = read(join(dir, 'result.json'));
  return result ? JSON.parse(result) : { type: 'internal-error', message: java.output };
}

async function judgeJava(dir, spec, code, cases = spec.cases) {
  const exec = await runJava(code, spec, cases);
  if (exec.type !== 'outputs') return { exec, results: [] };
  const outputs = exec.outputs.map(({ stdout, ...o }) => ({ ...o, logs: stdout }));
  const reference = (await load(join(dir, 'solution.js')))?.default;
  const checker = (await load(join(dir, 'checker.js')))?.default;
  return { exec, results: await gradeOutputs({ spec, cases, outputs, reference, checker }) };
}

describe.skipIf(!hasJdk)('java harness', () => {
  beforeAll(() => {
    const harness = readdirSync(join(JAVA_DIR, 'harness')).map((f) => join(JAVA_DIR, 'harness', f));
    const javac = spawnSync('javac', ['--release', '11', '-Xlint:all', '-Werror', '-d', harnessDir, ...harness], { encoding: 'utf8' });
    if (javac.status !== 0) throw new Error(`harness doesn't compile:\n${javac.stderr}`);
  });

  describe.concurrent.each(specFiles)('%s', (specFile) => {
    const dir = dirname(specFile);
    const spec = JSON.parse(readFileSync(specFile, 'utf8'));
    const solution = read(join(dir, 'solution.java'));

    test.runIf(solution)('solution.java passes every case', async () => {
      const { exec, results } = await judgeJava(dir, spec, solution);
      expect(exec.type, JSON.stringify(exec).slice(0, 800)).toBe('outputs');
      for (const r of results) {
        expect(r.passed, `case ${r.index + 1}: output ${r.output} expected ${r.expected} ${r.error?.message ?? ''}`).toBe(true);
      }
    }, 60000);

    test('Java starter compiles, runs cleanly and fails at least one case', async () => {
      const starter = read(join(dir, 'starter.java')) ?? javaStub(spec, read(join(dir, 'starter.js')));
      const { exec, results } = await judgeJava(dir, spec, starter);
      expect(exec.type, JSON.stringify(exec).slice(0, 800)).toBe('outputs');
      // Every case value must fit the starter's declared types.
      const typeErrors = results.filter((r) => r.error?.message.includes("Can't pass"));
      expect(typeErrors.map((r) => r.error.message)).toEqual([]);
      expect(results.some((r) => r.passed === false)).toBe(true);
    }, 60000);
  });

  describe('runner behaviour', () => {
    const dir = 'content/dsa/arrays-hashing/two-sum';
    const spec = JSON.parse(readFileSync(join(dir, 'cases.json'), 'utf8'));
    const twoCases = spec.cases.slice(0, 2);
    const solution = (body) => `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n${body}\n    }\n}\n`;

    it('reports compile errors with the user file’s line numbers', async () => {
      const exec = await runJava(solution('        int x = "s";\n        return null;'), spec, twoCases);
      expect(exec.type).toBe('compile-error');
      expect(exec.message).toMatch(/^Solution\.java:3: error: incompatible types/);
    });

    it('points a runtime exception at the line in the user file', async () => {
      const exec = await runJava(solution('        int[] a = new int[1];\n        return new int[] { a[5] };'), spec, twoCases);
      expect(exec.outputs[0].error).toEqual({ message: 'ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 1', line: 4 });
    });

    it('captures System.out and System.err per testcase', async () => {
      const exec = await runJava(solution('        System.out.println("nums " + Arrays.toString(nums));\n        System.err.println("ünïcode ✓");\n        return new int[] {0, 1};'), spec, twoCases);
      expect(exec.outputs[0].stdout).toEqual([
        ['log', 'nums [2, 7, 11, 15]'],
        ['error', 'ünïcode ✓'],
      ]);
    });

    it('lets users change the signature (List<Integer> instead of int[])', async () => {
      const code = 'class Solution {\n    public List<Integer> twoSum(List<Integer> nums, long target) {\n        return List.of(0, 1);\n    }\n}\n';
      const exec = await runJava(code, spec, twoCases);
      expect(exec.outputs[0]).toMatchObject({ output: [0, 1] });
    });

    it('explains a missing method and survives StackOverflowError', async () => {
      const missing = await runJava('class Solution {}\n', spec, twoCases);
      expect(missing.outputs[0].error.message).toMatch(/Define class Solution with a method twoSum/);
      const deep = await runJava(solution('        return twoSum(nums, target);'), spec, twoCases);
      expect(deep.outputs[0].error.message).toMatch(/^StackOverflowError/);
      expect(deep.outputs[0].error.line).toBe(3);
    });

    it('judges a custom testcase against the JS reference', async () => {
      const { results } = await judgeJava(dir, spec, read(join(dir, 'solution.java')), [{ input: [[5, 1, 4], 9] }]);
      expect(results[0]).toMatchObject({ passed: true, expected: '[0,2]' });
    });
  });
});
