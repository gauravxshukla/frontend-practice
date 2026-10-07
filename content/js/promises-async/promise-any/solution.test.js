import promiseAny from './solution.js';

const resolveAfter = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const rejectAfter = (reason, ms) => new Promise((_, reject) => setTimeout(() => reject(reason), ms));

async function catchError(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  throw new Error('expected the promise to reject');
}

describe('promiseAny', () => {
  test('example: resolves with the first fulfilment, ignoring rejections', async () => {
    await expect(promiseAny([Promise.reject('a'), resolveAfter('slow', 20), 'now'])).resolves.toBe('now');
  });

  test('example: rejects with an AggregateError when every input rejects', async () => {
    const error = await catchError(promiseAny([Promise.reject(1), Promise.reject(2)]));
    expect(error).toBeInstanceOf(AggregateError);
    expect(error.errors).toEqual([1, 2]);
  });

  test('returns a Promise', () => {
    const result = promiseAny([1]);
    expect(result).toBeInstanceOf(Promise);
  });

  test('picks the earliest fulfilment by time, not by position', async () => {
    await expect(promiseAny([resolveAfter('slow', 40), resolveAfter('fast', 10)])).resolves.toBe('fast');
  });

  test('waits past early rejections for a later fulfilment', async () => {
    await expect(promiseAny([rejectAfter('x', 5), resolveAfter('ok', 30), rejectAfter('y', 10)])).resolves.toBe('ok');
  });

  test('AggregateError.errors are in input order, not settle order', async () => {
    const error = await catchError(promiseAny([rejectAfter('first', 40), rejectAfter('second', 10), rejectAfter('third', 25)]));
    expect(error).toBeInstanceOf(AggregateError);
    expect(error.errors).toEqual(['first', 'second', 'third']);
  });

  test('an empty input rejects with an AggregateError', async () => {
    const error = await catchError(promiseAny([]));
    expect(error).toBeInstanceOf(AggregateError);
    expect(error.errors).toEqual([]);
  });

  test('accepts non-promise values', async () => {
    await expect(promiseAny([Promise.reject(new Error('no')), 42])).resolves.toBe(42);
  });

  test('accepts any iterable, such as a Set', async () => {
    await expect(promiseAny(new Set([rejectAfter('x', 5), resolveAfter('from set', 10)]))).resolves.toBe('from set');
  });

  test('does not use the native Promise.any', async () => {
    const spy = jest.spyOn(Promise, 'any');
    try {
      await promiseAny([resolveAfter(1, 5)]);
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });
});
