import promiseAll from './solution.js';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const fail = (reason, ms) => new Promise((_, reject) => setTimeout(() => reject(reason), ms));

async function catchError(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  throw new Error('expected the promise to reject');
}

describe('promiseAll', () => {
  test('example: resolves values, promises and delayed promises in order', async () => {
    expect(await promiseAll([1, Promise.resolve(2), delay(3, 10)])).toEqual([1, 2, 3]);
  });

  test('example: rejects with the rejection reason', async () => {
    await expect(promiseAll([Promise.resolve(1), Promise.reject('boom')])).rejects.toBe('boom');
  });

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

  test('when several inputs reject, the earliest rejection wins', async () => {
    const error = await catchError(promiseAll([fail('late', 40), fail('early', 10), delay(1, 5)]));
    expect(error).toBe('early');
  });

  test('rejects without waiting for slower inputs', async () => {
    const start = Date.now();
    const error = await catchError(promiseAll([delay('slow', 100), fail(new Error('fast'), 5)]));
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('fast');
    expect(Date.now() - start).toBeLessThan(70);
  });

  test('waits for the slowest input before resolving', async () => {
    const start = Date.now();
    await promiseAll([delay('a', 5), delay('b', 40)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(35);
  });

  test('keeps falsy and undefined results in their slots', async () => {
    const result = await promiseAll([0, Promise.resolve(''), delay(undefined, 5), null, false]);
    expect(result).toHaveLength(5);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe('');
    expect(2 in result).toBe(true);
    expect(result[2]).toBeUndefined();
    expect(result[3]).toBeNull();
    expect(result[4]).toBe(false);
  });

  test('does not mutate the input array', async () => {
    const input = [delay(1, 5), 2];
    const result = await promiseAll(input);
    expect(result).not.toBe(input);
    expect(input).toHaveLength(2);
    expect(input[1]).toBe(2);
  });

  test('does not use the native Promise.all', async () => {
    const spy = jest.spyOn(Promise, 'all');
    try {
      await promiseAll([delay(1, 5), 2]);
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });
});
