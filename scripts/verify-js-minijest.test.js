// Runs every JS suite through the in-browser runner (mini-Jest) in Node, the
// way the worker does: the reference solution must pass every test and the
// starter must fail at least one. Vitest already runs the suites directly, so
// this keeps the browser runner and Vitest from drifting apart.
import { existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect as vitestExpect } from 'vitest';
import { createJest } from '../src/features/runner/miniJest.js';
import { installDom } from '../src/features/runner/dom.js';
import { parseFrontmatter } from '../src/lib/content/frontmatter.js';

const only = process.env.JS_ONLY; // e.g. JS_ONLY=content/js/dom to check one topic
const suites = globSync('content/js/**/solution.test.js')
  .filter((f) => existsSync(join(dirname(f), 'solution.js')))
  .filter((f) => !only || f.startsWith(only))
  .sort();

const GLOBAL_NAMES = ['describe', 'test', 'it', 'beforeAll', 'afterAll', 'beforeEach', 'afterEach', 'expect', 'jest'];

/** Imports the suite against `variant` (solution.js / starter.js) and runs it with mini-Jest. */
async function runWithMiniJest(dir, variant, env) {
  if (env === 'dom') await installDom();
  const saved = Object.fromEntries(GLOBAL_NAMES.map((n) => [n, globalThis[n]]));
  const jest = createJest();
  Object.assign(globalThis, jest.globals);
  try {
    const target = JSON.stringify(pathToFileURL(resolve(dir, variant)).href);
    const source = readFileSync(join(dir, 'solution.test.js'), 'utf8').replace(/(['"])\.\/solution(?:\.js)?\1/g, target);
    // A unique URL per variant, so the starter and solution suites are separate module instances.
    await import(`data:text/javascript;base64,${Buffer.from(`${source}\n// ${variant}`).toString('base64')}`);
    return await jest.run();
  } finally {
    Object.assign(globalThis, saved);
  }
}

/**
 * Stubs often ignore the rejected promises a suite hands them, which Node reports as
 * unhandled rejections. That's expected for a starter, so mute them while it runs.
 */
async function withRejectionsMuted(run) {
  const listeners = process.listeners('unhandledRejection');
  process.removeAllListeners('unhandledRejection');
  process.on('unhandledRejection', () => {});
  try {
    return await run();
  } finally {
    await new Promise((r) => setTimeout(r, 50));
    process.removeAllListeners('unhandledRejection');
    for (const l of listeners) process.on('unhandledRejection', l);
  }
}

describe.each(suites)('%s', (suite) => {
  const dir = dirname(suite);
  const { data } = parseFrontmatter(readFileSync(join(dir, 'README.md'), 'utf8'));

  test('mini-Jest: reference solution passes every test', async () => {
    const results = await runWithMiniJest(dir, 'solution.js', data.env);
    const failed = results.filter((r) => !r.passed).map((r) => `${r.name}: ${r.error?.message}`);
    vitestExpect(results.length).toBeGreaterThan(0);
    vitestExpect(failed).toEqual([]);
  });

  test('mini-Jest: starter fails at least one test', async () => {
    let results;
    try {
      results = await withRejectionsMuted(() => runWithMiniJest(dir, 'starter.js', data.env));
    } catch {
      return; // The starter doesn't even load: that counts as failing.
    }
    vitestExpect(results.some((r) => !r.passed)).toBe(true);
  });
});
