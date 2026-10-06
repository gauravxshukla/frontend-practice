import promiseAll from './solution.js';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

describe('promiseAll', () => {
  test('resolves an empty array', async () => {
    expect(await promiseAll([])).toEqual([]);
  });

  test('keeps input order even when later items settle first', async () => {
    expect(await promiseAll([delay(1, 30), delay(2, 10), delay(3, 20)])).toEqual([1, 2, 3]);
  });

  test('accepts non-promise values', async () => {
    expect(await promiseAll([1, Promise.resolve(2), 3])).toEqual([1, 2, 3]);
  });

  test('rejects with the first rejection reason', async () => {
    let reason;
    try {
      await promiseAll([delay(1, 20), Promise.reject('boom')]);
    } catch (e) {
      reason = e;
    }
    expect(reason).toBe('boom');
  });

  test('returns a promise', () => {
    const result = promiseAll([]);
    expect(result instanceof Promise).toBe(true);
  });
});
