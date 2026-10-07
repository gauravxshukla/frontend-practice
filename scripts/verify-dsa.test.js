// Grades every DSA reference solution with the same core the browser uses,
// and checks every starter fails, so a stub can never pass as "Accepted".
import { existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execute, judge } from '../src/features/runner/core.js';

const only = process.env.DSA_ONLY; // e.g. DSA_ONLY=content/dsa/trees to verify one folder
const specFiles = globSync('content/dsa/**/cases.json').filter((f) => !only || f.startsWith(only)).sort();

async function load(path) {
  return existsSync(path) ? import(pathToFileURL(resolve(path)).href) : null;
}

async function grade(spec, exported, checker, kase) {
  try {
    const output = await execute(spec, exported, kase.input);
    return { ok: judge(spec, output, kase.expected, kase.input, checker), output };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

describe.each(specFiles)('%s', (specFile) => {
  const dir = dirname(specFile);
  const spec = JSON.parse(readFileSync(specFile, 'utf8'));

  test('reference solution passes every case', async () => {
    const solution = await load(join(dir, 'solution.js'));
    if (!solution) return; // prompt-only question
    const checker = (await load(join(dir, 'checker.js')))?.default;
    for (const [i, kase] of spec.cases.entries()) {
      const result = await grade(spec, solution.default, checker, kase);
      expect(
        result.ok,
        `case ${i + 1} ${JSON.stringify(kase.input).slice(0, 200)}\n  output:   ${JSON.stringify(result.output)}\n  expected: ${JSON.stringify(kase.expected)}\n  error:    ${result.error ?? '-'}`,
      ).toBe(true);
    }
  });

  test('starter fails at least one case', async () => {
    const starter = await load(join(dir, 'starter.js'));
    const checker = (await load(join(dir, 'checker.js')))?.default;
    let failures = 0;
    for (const kase of spec.cases) {
      if (!(await grade(spec, starter?.default, checker, kase)).ok) failures++;
    }
    expect(failures, 'the starter passes every case, so the tests prove nothing').toBeGreaterThan(0);
  });
});
