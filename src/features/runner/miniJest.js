// A small Jest-compatible test runner for the browser worker. It covers what the
// JS questions' suites use (describe/test/expect + hooks) and the common matchers,
// so the same `solution.test.js` runs here and under Vitest in `npm run verify`
// (where scripts/vitest-setup.js aliases `jest` to `vi`). Timers are real: no fake timers.

const TEST_TIMEOUT_MS = 2000;

/** Readable value printer for assertion messages and console capture. */
export function format(value, depth = 0) {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return depth ? JSON.stringify(value) : value;
  if (typeof value === 'number') return Object.is(value, -0) ? '-0' : String(value);
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`;
  if (typeof value === 'symbol') return value.toString();
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (value instanceof Promise) return 'Promise {}';
  if (typeof value.asymmetricMatch === 'function') return value.toString();
  if (depth > 4) return Array.isArray(value) ? '[…]' : '{…}';
  if (Array.isArray(value)) {
    const items = [];
    for (let i = 0; i < value.length; i++) items.push(i in value ? format(value[i], depth + 1) : '<empty>');
    return `[${items.join(', ')}]`;
  }
  if (value instanceof Map) return `Map(${value.size}) {${[...value].map(([k, v]) => `${format(k, depth + 1)} => ${format(v, depth + 1)}`).join(', ')}}`;
  if (value instanceof Set) return `Set(${value.size}) {${[...value].map((v) => format(v, depth + 1)).join(', ')}}`;
  const entries = Object.entries(value).map(([k, v]) => `${k}: ${format(v, depth + 1)}`);
  return `{${entries.length ? ` ${entries.join(', ')} ` : ''}}`;
}

/** Asymmetric matchers (`expect.any(Function)`, `expect.anything()`) compare by predicate. */
const isAsymmetric = (v) => v !== null && typeof v === 'object' && typeof v.asymmetricMatch === 'function';

/** Jest's toEqual: recursive, ignores properties whose value is undefined. */
function equals(a, b) {
  if (isAsymmetric(b)) return b.asymmetricMatch(a);
  if (isAsymmetric(a)) return a.asymmetricMatch(b);
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && a.length !== b.length) return false;
  if (a instanceof Date || b instanceof Date) return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  if (a instanceof RegExp || b instanceof RegExp) return String(a) === String(b);
  if (a instanceof Map || a instanceof Set) return equals([...a], [...b]);
  const keys = (o) => Object.keys(o).filter((k) => o[k] !== undefined);
  const ka = keys(a);
  const kb = keys(b);
  return ka.length === kb.length && ka.every((k) => equals(a[k], b[k]));
}

/** toMatchObject: every property in `subset` matches; arrays match element-wise. */
function matchesObject(actual, subset) {
  if (isAsymmetric(subset)) return subset.asymmetricMatch(actual);
  if (typeof subset !== 'object' || subset === null) return equals(actual, subset);
  if (typeof actual !== 'object' || actual === null) return false;
  if (Array.isArray(subset)) {
    return Array.isArray(actual) && actual.length === subset.length && subset.every((v, i) => matchesObject(actual[i], v));
  }
  return Object.keys(subset).every((k) => k in actual && matchesObject(actual[k], subset[k]));
}

const asymmetric = {
  any: (Ctor) => ({
    asymmetricMatch: (v) =>
      v != null &&
      (Object(v) instanceof Ctor ||
        (Ctor === Number && typeof v === 'number') ||
        (Ctor === String && typeof v === 'string') ||
        (Ctor === Boolean && typeof v === 'boolean') ||
        (Ctor === Function && typeof v === 'function')),
    toString: () => `Any<${Ctor?.name}>`,
  }),
  anything: () => ({ asymmetricMatch: (v) => v != null, toString: () => 'Anything' }),
};

/* ---------------------------------------------------------------- mock functions */

/** `jest.fn()`: records calls and results; a subset of Jest's / Vitest's mock API. */
function fn(implementation) {
  const mock = { calls: [], results: [], instances: [] };
  const once = [];
  let impl = implementation;
  function mockFn(...args) {
    mock.calls.push(args);
    mock.instances.push(this);
    const run = once.length ? once.shift() : impl;
    try {
      const value = run ? run.apply(this, args) : undefined;
      mock.results.push({ type: 'return', value });
      return value;
    } catch (error) {
      mock.results.push({ type: 'throw', value: error });
      throw error;
    }
  }
  Object.assign(mockFn, {
    mock,
    _isMockFunction: true,
    mockImplementation: (f) => ((impl = f), mockFn),
    mockImplementationOnce: (f) => (once.push(f), mockFn),
    mockReturnValue: (v) => mockFn.mockImplementation(() => v),
    mockReturnValueOnce: (v) => mockFn.mockImplementationOnce(() => v),
    mockResolvedValue: (v) => mockFn.mockImplementation(() => Promise.resolve(v)),
    mockResolvedValueOnce: (v) => mockFn.mockImplementationOnce(() => Promise.resolve(v)),
    mockRejectedValue: (e) => mockFn.mockImplementation(() => Promise.reject(e)),
    mockRejectedValueOnce: (e) => mockFn.mockImplementationOnce(() => Promise.reject(e)),
    mockClear: () => {
      mock.calls.length = 0;
      mock.results.length = 0;
      mock.instances.length = 0;
      return mockFn;
    },
    mockReset: () => {
      mockFn.mockClear();
      once.length = 0;
      impl = undefined;
      return mockFn;
    },
  });
  return mockFn;
}

/** `jest.spyOn(obj, 'method')`: wraps the real method; `mockRestore()` puts it back. */
function spyOn(object, method) {
  const original = object[method];
  const spy = fn(function (...args) {
    return original.apply(this, args);
  });
  spy.mockRestore = () => {
    object[method] = original;
  };
  object[method] = spy;
  return spy;
}

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}

const isMock = (v) => typeof v === 'function' && v._isMockFunction === true;
const formatArgs = (args) => args.map((a) => format(a, 1)).join(', ');

/** Matchers for one received value. `fromPromise` marks values unwrapped by .resolves / .rejects. */
function matchersFor(actual, negate, fromPromise) {
  const prefix = `expect(received)${fromPromise ? `.${fromPromise}` : ''}${negate ? '.not' : ''}`;
  const assert = (pass, matcher, expectedText, receivedText = format(actual, 1)) => {
    if (pass === negate) {
      throw new AssertionError(
        `${prefix}.${matcher}\n\n` +
          (expectedText !== undefined ? `Expected: ${negate ? 'not ' : ''}${expectedText}\n` : '') +
          `Received: ${receivedText}`,
      );
    }
  };
  const calls = (matcher) => {
    if (!isMock(actual)) throw new AssertionError(`${prefix}.${matcher}\n\nReceived value must be a mock function (jest.fn())`);
    return actual.mock.calls;
  };
  const callsText = (list) => (list.length ? list.map((c, i) => `${i + 1}: (${formatArgs(c)})`).join('\n          ') : 'no calls');

  return {
    toBe: (exp) => assert(Object.is(actual, exp), 'toBe(expected)', format(exp, 1)),
    toEqual: (exp) => assert(equals(actual, exp), 'toEqual(expected)', format(exp, 1)),
    toStrictEqual: (exp) => assert(equals(actual, exp), 'toStrictEqual(expected)', format(exp, 1)),
    toMatchObject: (exp) => assert(matchesObject(actual, exp), 'toMatchObject(expected)', format(exp, 1)),
    toBeTruthy: () => assert(Boolean(actual), 'toBeTruthy()', 'truthy'),
    toBeFalsy: () => assert(!actual, 'toBeFalsy()', 'falsy'),
    toBeNull: () => assert(actual === null, 'toBeNull()', 'null'),
    toBeUndefined: () => assert(actual === undefined, 'toBeUndefined()', 'undefined'),
    toBeDefined: () => assert(actual !== undefined, 'toBeDefined()', 'defined'),
    toBeNaN: () => assert(Number.isNaN(actual), 'toBeNaN()', 'NaN'),
    toBeGreaterThan: (n) => assert(actual > n, 'toBeGreaterThan(expected)', `> ${n}`),
    toBeGreaterThanOrEqual: (n) => assert(actual >= n, 'toBeGreaterThanOrEqual(expected)', `>= ${n}`),
    toBeLessThan: (n) => assert(actual < n, 'toBeLessThan(expected)', `< ${n}`),
    toBeLessThanOrEqual: (n) => assert(actual <= n, 'toBeLessThanOrEqual(expected)', `<= ${n}`),
    toBeCloseTo: (n, digits = 2) => assert(Math.abs(actual - n) < 10 ** -digits / 2, 'toBeCloseTo(expected)', format(n)),
    toBeInstanceOf: (C) => assert(actual instanceof C, 'toBeInstanceOf(expected)', C?.name),
    toBeTypeOf: (type) => assert(typeof actual === type, 'toBeTypeOf(expected)', type, typeof actual),
    toMatch: (pattern) =>
      assert(
        typeof actual === 'string' && (typeof pattern === 'string' ? actual.includes(pattern) : pattern.test(actual)),
        'toMatch(expected)',
        format(pattern, 1),
      ),
    toContain: (item) =>
      assert(
        typeof actual === 'string' ? actual.includes(item) : [...(actual ?? [])].includes(item),
        'toContain(expected)',
        format(item, 1),
      ),
    toContainEqual: (item) =>
      assert([...(actual ?? [])].some((v) => equals(v, item)), 'toContainEqual(expected)', format(item, 1)),
    toHaveLength: (n) => assert(actual?.length === n, 'toHaveLength(expected)', `length ${n}`, `length ${actual?.length}`),
    toHaveProperty: (key, ...value) => {
      const path = Array.isArray(key) ? key : String(key).split('.');
      let cur = actual;
      let has = actual != null;
      for (const k of path) {
        if (cur == null || !(k in Object(cur))) {
          has = false;
          break;
        }
        cur = cur[k];
      }
      const pass = has && (value.length === 0 || equals(cur, value[0]));
      assert(pass, 'toHaveProperty(path)', value.length ? `${path.join('.')} = ${format(value[0], 1)}` : path.join('.'));
    },
    toThrow: (expected) => {
      let thrown;
      let didThrow = false;
      if (fromPromise === 'rejects') {
        // .rejects.toThrow() inspects the rejection reason.
        thrown = actual;
        didThrow = true;
      } else {
        try {
          actual();
        } catch (e) {
          thrown = e;
          didThrow = true;
        }
      }
      const message = String(thrown?.message ?? thrown);
      const matches =
        didThrow &&
        (expected === undefined ||
          (typeof expected === 'string' && message.includes(expected)) ||
          (expected instanceof RegExp && expected.test(message)) ||
          (typeof expected === 'function' && thrown instanceof expected) ||
          (expected instanceof Error && message === expected.message));
      assert(
        matches,
        'toThrow()',
        expected === undefined ? 'a thrown error' : format(expected),
        didThrow ? format(thrown) : 'nothing thrown',
      );
    },
    toHaveBeenCalled: () => {
      const list = calls('toHaveBeenCalled()');
      assert(list.length > 0, 'toHaveBeenCalled()', 'at least one call', callsText(list));
    },
    toHaveBeenCalledTimes: (n) => {
      const list = calls('toHaveBeenCalledTimes(expected)');
      assert(list.length === n, 'toHaveBeenCalledTimes(expected)', `${n} call(s)`, `${list.length} call(s)`);
    },
    toHaveBeenCalledWith: (...args) => {
      const list = calls('toHaveBeenCalledWith(...expected)');
      assert(list.some((c) => equals(c, args)), 'toHaveBeenCalledWith(...expected)', `(${formatArgs(args)})`, callsText(list));
    },
    toHaveBeenLastCalledWith: (...args) => {
      const list = calls('toHaveBeenLastCalledWith(...expected)');
      assert(
        list.length > 0 && equals(list[list.length - 1], args),
        'toHaveBeenLastCalledWith(...expected)',
        `(${formatArgs(args)})`,
        callsText(list.slice(-1)),
      );
    },
    toHaveBeenNthCalledWith: (nth, ...args) => {
      const list = calls('toHaveBeenNthCalledWith(n, ...expected)');
      assert(
        list.length >= nth && equals(list[nth - 1], args),
        'toHaveBeenNthCalledWith(n, ...expected)',
        `call ${nth}: (${formatArgs(args)})`,
        callsText(list),
      );
    },
  };
}

const MATCHER_NAMES = Object.keys(matchersFor(undefined, false));

/** `.resolves` / `.rejects`: await the promise, then run the matcher on its outcome. */
function promiseMatchers(promise, mode, negate) {
  return Object.fromEntries(
    MATCHER_NAMES.map((name) => [
      name,
      async (...args) => {
        let value;
        let rejected = false;
        try {
          value = await promise;
        } catch (e) {
          value = e;
          rejected = true;
        }
        if (mode === 'resolves' && rejected) {
          throw new AssertionError(`expect(received).resolves.${name}()\n\nReceived promise rejected instead of resolved\nRejected to value: ${format(value, 1)}`);
        }
        if (mode === 'rejects' && !rejected) {
          throw new AssertionError(`expect(received).rejects.${name}()\n\nReceived promise resolved instead of rejected\nResolved to value: ${format(value, 1)}`);
        }
        return matchersFor(value, negate, mode)[name](...args);
      },
    ]),
  );
}

function makeExpect() {
  function expect(actual) {
    const matchers = matchersFor(actual, false);
    matchers.not = matchersFor(actual, true);
    for (const mode of ['resolves', 'rejects']) {
      matchers[mode] = promiseMatchers(actual, mode, false);
      matchers[mode].not = promiseMatchers(actual, mode, true);
    }
    return matchers;
  }
  return Object.assign(expect, asymmetric);
}

/**
 * Creates an isolated registry. Install `globals` on globalThis, import the test
 * file (which registers tests), then call `run()`.
 */
export function createJest() {
  const newBlock = (name, parent) => ({ name, parent, items: [], beforeAll: [], afterAll: [], beforeEach: [], afterEach: [] });
  const root = newBlock('', null);
  let current = root;

  const fullName = (block, name) => {
    const parts = [];
    for (let b = block; b && b.parent; b = b.parent) parts.unshift(b.name);
    return [...parts, name].join(' › ');
  };

  const test = (name, body, timeout) => current.items.push({ kind: 'test', name: fullName(current, name), fn: body, timeout });
  // test.each([[1, 2], [3, 4]])('adds %i + %i', (a, b) => …): one test per row.
  test.each = (rows) => (name, body, timeout) =>
    rows.forEach((row, i) => {
      const args = Array.isArray(row) ? row : [row];
      let k = 0;
      const title = name.replace(/%[sdipjo#%]/g, (token) =>
        token === '%%' ? '%' : token === '%#' ? String(i) : format(args[k++], token === '%s' ? 0 : 1),
      );
      test(title, () => body(...args), timeout);
    });
  test.skip = () => {};
  test.todo = () => {};
  const globals = {
    describe(name, fn) {
      const block = newBlock(name, current);
      current.items.push({ kind: 'block', block });
      const parent = current;
      current = block;
      try {
        fn();
      } finally {
        current = parent;
      }
    },
    test,
    it: test,
    beforeAll: (fn) => current.beforeAll.push(fn),
    afterAll: (fn) => current.afterAll.push(fn),
    beforeEach: (fn) => current.beforeEach.push(fn),
    afterEach: (fn) => current.afterEach.push(fn),
    expect: makeExpect(),
    jest: { fn, spyOn },
  };

  function collect(block = root) {
    return block.items.flatMap((item) => (item.kind === 'test' ? [item.name] : collect(item.block)));
  }

  const withTimeout = (fn, ms) =>
    Promise.race([
      Promise.resolve().then(fn),
      new Promise((_, reject) => setTimeout(() => reject(new Error(`Test timed out after ${ms} ms`)), ms)),
    ]);

  const hooksFor = (block, key) => {
    const chain = [];
    for (let b = block; b; b = b.parent) chain.unshift(...b[key].map((fn) => fn));
    return key === 'afterEach' ? chain.reverse() : chain;
  };

  /**
   * @param {{ only?: string[], onTestStart?: (name: string) => void, onTestEnd?: () => void }} options
   */
  async function run({ only, onTestStart, onTestEnd } = {}) {
    const selected = new Set(only ?? collect());
    const results = [];

    async function runBlock(block) {
      const names = collect(block).filter((n) => selected.has(n));
      if (!names.length) return;
      let setupError = null;
      for (const hook of block.beforeAll) {
        try {
          await withTimeout(hook, TEST_TIMEOUT_MS);
        } catch (e) {
          setupError = e;
        }
      }
      for (const item of block.items) {
        if (item.kind === 'block') {
          await runBlock(item.block);
          continue;
        }
        if (!selected.has(item.name)) continue;
        onTestStart?.(item.name);
        const start = performance.now();
        let error = setupError;
        if (!error) {
          try {
            for (const hook of hooksFor(block, 'beforeEach')) await withTimeout(hook, TEST_TIMEOUT_MS);
            await withTimeout(item.fn, item.timeout ?? TEST_TIMEOUT_MS);
            for (const hook of hooksFor(block, 'afterEach')) await withTimeout(hook, TEST_TIMEOUT_MS);
          } catch (e) {
            error = e;
          }
        }
        results.push({
          name: item.name,
          passed: !error,
          durationMs: Math.round(performance.now() - start),
          error: error
            ? {
                // Assertion failures are wrong answers; anything else the code threw is a runtime error.
                assertion: error instanceof AssertionError,
                message: error instanceof AssertionError ? error.message : `${error?.name ?? 'Error'}: ${error?.message ?? error}`,
                stack: String(error?.stack ?? ''),
              }
            : null,
        });
        onTestEnd?.();
      }
      for (const hook of block.afterAll) {
        try {
          await withTimeout(hook, TEST_TIMEOUT_MS);
        } catch {
          // afterAll failures don't change test results.
        }
      }
    }

    await runBlock(root);
    return results;
  }

  return { globals, collect: () => collect(), run };
}
