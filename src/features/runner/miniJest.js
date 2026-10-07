// A small Jest-compatible test runner for the browser worker. It covers what the
// JS questions' suites use (describe/test/expect + hooks) and the common matchers,
// so the same `solution.test.js` runs here and under Vitest in `npm run verify`.

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

/** Jest's toEqual: recursive, ignores properties whose value is undefined. */
function equals(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && a.length !== b.length) return false;
  if (a instanceof Map || a instanceof Set) return equals([...a], [...b]);
  const keys = (o) => Object.keys(o).filter((k) => o[k] !== undefined);
  const ka = keys(a);
  const kb = keys(b);
  return ka.length === kb.length && ka.every((k) => equals(a[k], b[k]));
}

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}

function makeExpect() {
  return function expect(actual) {
    const build = (negate) => {
      const assert = (pass, matcher, expectedText, receivedText = format(actual, 1)) => {
        if (pass === negate) {
          throw new AssertionError(
            `expect(received)${negate ? '.not' : ''}.${matcher}\n\n` +
              (expectedText !== undefined ? `Expected: ${negate ? 'not ' : ''}${expectedText}\n` : '') +
              `Received: ${receivedText}`,
          );
        }
      };
      return {
        toBe: (exp) => assert(Object.is(actual, exp), 'toBe(expected)', format(exp, 1)),
        toEqual: (exp) => assert(equals(actual, exp), 'toEqual(expected)', format(exp, 1)),
        toStrictEqual: (exp) => assert(equals(actual, exp), 'toStrictEqual(expected)', format(exp, 1)),
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
        toBeCloseTo: (n, digits = 2) =>
          assert(Math.abs(actual - n) < 10 ** -digits / 2, 'toBeCloseTo(expected)', format(n)),
        toBeInstanceOf: (C) => assert(actual instanceof C, 'toBeInstanceOf(expected)', C?.name),
        toContain: (item) =>
          assert(
            typeof actual === 'string' ? actual.includes(item) : [...(actual ?? [])].includes(item),
            'toContain(expected)',
            format(item, 1),
          ),
        toHaveLength: (n) => assert(actual?.length === n, 'toHaveLength(expected)', `length ${n}`, `length ${actual?.length}`),
        toHaveProperty: (key) => assert(actual != null && key in Object(actual), 'toHaveProperty(path)', key),
        toThrow: (expected) => {
          let thrown;
          try {
            actual();
          } catch (e) {
            thrown = e;
          }
          const matches =
            thrown !== undefined &&
            (expected === undefined ||
              (typeof expected === 'string' && String(thrown?.message ?? thrown).includes(expected)) ||
              (expected instanceof RegExp && expected.test(String(thrown?.message ?? thrown))) ||
              (typeof expected === 'function' && thrown instanceof expected));
          assert(matches, 'toThrow()', expected === undefined ? 'a thrown error' : format(expected), thrown === undefined ? 'nothing thrown' : format(thrown));
        },
      };
    };
    const matchers = build(false);
    matchers.not = build(true);
    return matchers;
  };
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

  const test = (name, fn, timeout) => current.items.push({ kind: 'test', name: fullName(current, name), fn, timeout });
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
