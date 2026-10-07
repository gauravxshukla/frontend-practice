// Runs user code off the main thread. The main thread kills this worker on a
// timeout, which is how infinite loops become "Time Limit Exceeded".
import { errorLine, execute, formatInput, judge } from './core.js';
import { createJest, format } from './miniJest.js';

/* ------------------------------------------------------------ console capture */

let logs = [];
for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
  console[level] = (...args) => {
    if (logs.length < 200) logs.push(args.map((a) => format(a)).join(' '));
  };
}

async function importSource(code) {
  const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  return { url, module: await import(/* @vite-ignore */ url) };
}

function describeError(error, url) {
  return { message: `${error?.name ?? 'Error'}: ${error?.message ?? String(error)}`, line: errorLine(error, url) };
}

/* ------------------------------------------------------------------- DSA jobs */

async function runDsa({ userCode, refCode, checkerCode, spec, cases }) {
  let user;
  try {
    user = await importSource(userCode);
  } catch (error) {
    return { type: 'compile-error', message: `${error.name}: ${error.message}` };
  }
  const ref = refCode ? (await importSource(refCode)).module : null;
  const checker = checkerCode ? (await importSource(checkerCode)).module.default : undefined;
  const isChecker = spec.compare === 'checker';

  const results = [];
  const started = performance.now();
  for (const [index, kase] of cases.entries()) {
    let expected = kase.expected;
    let hasExpected = 'expected' in kase;
    // Custom testcases have no expected value: ask the reference solution.
    if (!hasExpected && ref && !isChecker) {
      try {
        expected = await execute(spec, ref.default, kase.input);
        hasExpected = true;
      } catch {
        // Invalid custom input for the reference too; just show the output.
      }
    }

    logs = [];
    const result = { index, hidden: Boolean(kase.hidden), input: formatInput(spec, kase.input), stdout: [] };
    try {
      const output = await execute(spec, user.module.default, kase.input);
      result.output = JSON.stringify(output);
      result.passed = hasExpected || isChecker ? judge(spec, output, expected, kase.input, checker) : null;
    } catch (error) {
      result.error = describeError(error, user.url);
      result.passed = false;
    }
    result.expected = hasExpected ? JSON.stringify(expected) : undefined;
    result.stdout = logs;
    results.push(result);
  }
  return { type: 'done', results, runtimeMs: Math.round(performance.now() - started) };
}

/* -------------------------------------------------------------------- JS jobs */

async function loadSuite(userCode, testCode) {
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

async function runJest({ userCode, testCode, only }) {
  const loaded = await loadSuite(userCode, testCode);
  if (loaded.compileError) return { type: 'compile-error', message: loaded.compileError };

  const started = performance.now();
  const stdoutByTest = new Map();
  let currentTest = null;
  const results = await loaded.jest.run({
    only,
    onTestStart: (name) => {
      currentTest = name;
      logs = [];
    },
    onTestEnd: () => stdoutByTest.set(currentTest, logs),
  });
  return {
    type: 'done',
    runtimeMs: Math.round(performance.now() - started),
    results: results.map((r, index) => ({
      index,
      name: r.name,
      passed: r.passed,
      stdout: stdoutByTest.get(r.name) ?? [],
      failure: r.error?.assertion ? r.error.message : undefined,
      error:
        r.error && !r.error.assertion
          ? { message: r.error.message, line: errorLine({ stack: r.error.stack }, loaded.user.url) }
          : undefined,
    })),
  };
}

async function collectJest({ userCode, testCode }) {
  const loaded = await loadSuite(userCode, testCode);
  return { type: 'collected', names: loaded.jest ? loaded.jest.collect() : [] };
}

/* ------------------------------------------------------------------ dispatch */

self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'dsa') self.postMessage(await runDsa(data));
    else if (data.type === 'jest') self.postMessage(await runJest(data));
    else if (data.type === 'jest-collect') self.postMessage(await collectJest(data));
  } catch (error) {
    self.postMessage({ type: 'internal-error', message: `${error?.name ?? 'Error'}: ${error?.message ?? error}` });
  }
};
