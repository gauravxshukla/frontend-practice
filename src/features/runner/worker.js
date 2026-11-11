// Runs user code off the main thread. The main thread kills this worker on a
// timeout, which is how infinite loops become "Time Limit Exceeded".
import { errorLine, execute, expectedFor, formatInput, gradeOutputs, judge } from './core.js';
import { createJest } from './miniJest.js';
import { installDom } from './dom.js';
import { serializeValue } from '../console/serialize.js';

/* ------------------------------------------------------------ console capture */

// Entries are structured (see src/features/console/types.ts) so the result
// panel can show logged objects as expandable trees.
const MAX_LOGS = 200;
let logs = [];
let logSeq = 0;
for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
  console[level] = (...args) => {
    if (logs.length < MAX_LOGS) {
      logs.push({ id: String(logSeq++), level, args: args.map((a) => serializeValue(a)), count: 1 });
    }
  };
}

// Suites hand rejected promises to user code, and an unfinished solution often
// ignores them. Those rejections aren't the user's bug to see in DevTools; the
// verdict already reports what went wrong.
self.addEventListener('unhandledrejection', (event) => event.preventDefault());

async function importSource(code) {
  const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  return { url, module: await import(/* @vite-ignore */ url) };
}

function describeError(error, url) {
  return { message: `${error?.name ?? 'Error'}: ${error?.message ?? String(error)}`, line: errorLine(error, url) };
}

/* ------------------------------------------------------------------- DSA jobs */

/** The JS reference (for custom testcases' expected values) and the checker, if any. */
async function loadJudging(refCode, checkerCode) {
  const reference = refCode ? (await importSource(refCode)).module.default : undefined;
  const checker = checkerCode ? (await importSource(checkerCode)).module.default : undefined;
  return { reference, checker };
}

async function runDsa({ userCode, refCode, checkerCode, spec, cases }) {
  let user;
  try {
    user = await importSource(userCode);
  } catch (error) {
    return { type: 'compile-error', message: `${error.name}: ${error.message}` };
  }
  const { reference, checker } = await loadJudging(refCode, checkerCode);
  const isChecker = spec.compare === 'checker';

  const results = [];
  const started = performance.now();
  for (const [index, kase] of cases.entries()) {
    const { hasExpected, expected } = await expectedFor(spec, kase, reference);

    logs = [];
    const result = { index, hidden: Boolean(kase.hidden), input: formatInput(spec, kase.input), logs: [] };
    try {
      const output = await execute(spec, user.module.default, kase.input);
      result.output = JSON.stringify(output);
      result.passed = hasExpected || isChecker ? judge(spec, output, expected, kase.input, checker) : null;
    } catch (error) {
      result.error = describeError(error, user.url);
      result.passed = false;
    }
    result.expected = hasExpected ? JSON.stringify(expected) : undefined;
    result.logs = logs;
    results.push(result);
  }
  return { type: 'done', results, runtimeMs: Math.round(performance.now() - started) };
}

/** Judges outputs from another language's runtime (Python…) with the same core. */
async function runDsaJudge({ spec, cases, outputs, runtimeMs, refCode, checkerCode }) {
  const { reference, checker } = await loadJudging(refCode, checkerCode);
  const results = await gradeOutputs({ spec, cases, outputs, reference, checker });
  return { type: 'done', results, runtimeMs };
}

/* -------------------------------------------------------------------- JS jobs */

async function loadSuite(userCode, testCode, env) {
  // DOM questions get a fresh document before any user code runs.
  if (env === 'dom') await installDom();
  let user;
  try {
    user = await importSource(userCode);
  } catch (error) {
    return { compileError: `${error.name}: ${error.message}` };
  }
  const jest = createJest();
  Object.assign(globalThis, jest.globals);
  // The suite imports `./solution.js`; point it at the user's module instead.
  const suite = testCode.replace(/(['"])\.\/solution(?:\.js)?\1/g, JSON.stringify(user.url));
  await importSource(suite);
  return { jest, user };
}

async function runJest({ userCode, testCode, env, only }) {
  const loaded = await loadSuite(userCode, testCode, env);
  if (loaded.compileError) return { type: 'compile-error', message: loaded.compileError };

  const started = performance.now();
  const logsByTest = new Map();
  let currentTest = null;
  const results = await loaded.jest.run({
    only,
    onTestStart: (name) => {
      currentTest = name;
      logs = [];
    },
    onTestEnd: () => logsByTest.set(currentTest, logs),
  });
  return {
    type: 'done',
    runtimeMs: Math.round(performance.now() - started),
    results: results.map((r, index) => ({
      index,
      name: r.name,
      passed: r.passed,
      logs: logsByTest.get(r.name) ?? [],
      failure: r.error?.assertion ? r.error.message : undefined,
      error:
        r.error && !r.error.assertion
          ? { message: r.error.message, line: errorLine({ stack: r.error.stack }, loaded.user.url) }
          : undefined,
    })),
  };
}

async function collectJest({ userCode, testCode, env }) {
  const loaded = await loadSuite(userCode, testCode, env);
  return { type: 'collected', names: loaded.jest ? loaded.jest.collect() : [] };
}

/* ------------------------------------------------------------------ dispatch */

self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'dsa') self.postMessage(await runDsa(data));
    else if (data.type === 'dsa-judge') self.postMessage(await runDsaJudge(data));
    else if (data.type === 'jest') self.postMessage(await runJest(data));
    else if (data.type === 'jest-collect') self.postMessage(await collectJest(data));
  } catch (error) {
    self.postMessage({ type: 'internal-error', message: `${error?.name ?? 'Error'}: ${error?.message ?? error}` });
  }
};
