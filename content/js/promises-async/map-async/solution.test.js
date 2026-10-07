import mapAsync from './solution.js';

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

describe('mapAsync', () => {
  test('example: doubles every element', async () => {
    const double = (n) => delay(n * 2, 10);
    expect(await mapAsync([1, 2, 3], double)).toEqual([2, 4, 6]);
  });

  test('example: rejects with the reason of a failed call', async () => {
    const error = await catchError(mapAsync([1, 2], (n) => (n === 2 ? Promise.reject('bad') : delay(n * 2, 10))));
    expect(error).toBe('bad');
  });

  test('empty input', async () => {
    expect(await mapAsync([], (x) => delay(x, 1))).toEqual([]);
  });

  test('waits for all, keeps order even when the last item finishes first', async () => {
    const result = await mapAsync([30, 20, 1], (ms) => delay(ms * 2, ms));
    expect(result).toEqual([60, 40, 2]);
  });

  test('runs in parallel', async () => {
    const start = Date.now();
    await mapAsync([30, 30, 30], (ms) => delay(ms, ms));
    expect(Date.now() - start).toBeLessThan(80);
  });

  test('rejects if any callback rejects', async () => {
    let reason;
    try {
      await mapAsync([1, 2], (x) => (x === 2 ? Promise.reject('bad') : delay(x, 5)));
    } catch (e) {
      reason = e;
    }
    expect(reason).toBe('bad');
  });

  test('returns a promise', () => {
    expect(mapAsync([], (x) => x)).toBeInstanceOf(Promise);
  });

  test('starts every call synchronously, once per element', () => {
    const spy = jest.fn((x) => delay(x, 5));
    mapAsync(['a', 'b', 'c'], spy);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls.map((args) => args[0])).toEqual(['a', 'b', 'c']);
  });

  test('an empty input never calls the callback', async () => {
    const spy = jest.fn();
    await mapAsync([], spy);
    expect(spy).not.toHaveBeenCalled();
  });

  test('when several calls reject, the earliest rejection wins', async () => {
    const error = await catchError(mapAsync([40, 10, 25], (ms) => fail(`failed after ${ms}`, ms)));
    expect(error).toBe('failed after 10');
  });

  test('a synchronous throw becomes a rejection', async () => {
    const promise = mapAsync([1], () => {
      throw new Error('sync boom');
    });
    expect(promise).toBeInstanceOf(Promise);
    const error = await catchError(promise);
    expect(error.message).toBe('sync boom');
  });

  test('accepts plain (non-promise) return values', async () => {
    expect(await mapAsync([1, 2, 3], (n) => n + 1)).toEqual([2, 3, 4]);
  });

  test('does not mutate the input', async () => {
    const input = [1, 2, 3];
    const result = await mapAsync(input, (n) => delay(n * 10, 5));
    expect(input).toEqual([1, 2, 3]);
    expect(result).not.toBe(input);
  });
});
