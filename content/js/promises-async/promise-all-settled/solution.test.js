import promiseAllSettled from './solution.js';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const fail = (reason, ms) => new Promise((_, reject) => setTimeout(() => reject(reason), ms));

describe('promiseAllSettled', () => {
  test('example: reports a plain value and a rejection', async () => {
    expect(await promiseAllSettled([1, Promise.reject('x')])).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: 'x' },
    ]);
  });

  test('example: resolves even when every input rejects', async () => {
    expect(await promiseAllSettled([Promise.reject(1), Promise.reject(2)])).toEqual([
      { status: 'rejected', reason: 1 },
      { status: 'rejected', reason: 2 },
    ]);
  });

  test('empty input', async () => {
    expect(await promiseAllSettled([])).toEqual([]);
  });

  test('mixed outcomes in input order', async () => {
    expect(await promiseAllSettled([delay(1, 20), Promise.reject('x'), 3])).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: 'x' },
      { status: 'fulfilled', value: 3 },
    ]);
  });

  test('never rejects when everything fails', async () => {
    const result = await promiseAllSettled([Promise.reject(1), Promise.reject(2)]);
    expect(result.map((r) => r.status)).toEqual(['rejected', 'rejected']);
  });

  test('returns a promise', () => {
    expect(promiseAllSettled([])).toBeInstanceOf(Promise);
  });

  test('results are in input order, not settle order', async () => {
    const result = await promiseAllSettled([delay('a', 30), fail('b', 5), delay('c', 15)]);
    expect(result).toEqual([
      { status: 'fulfilled', value: 'a' },
      { status: 'rejected', reason: 'b' },
      { status: 'fulfilled', value: 'c' },
    ]);
  });

  test('waits for the slowest input, even after an early rejection', async () => {
    const start = Date.now();
    const result = await promiseAllSettled([fail('early', 5), delay('late', 40)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(35);
    expect(result[1]).toEqual({ status: 'fulfilled', value: 'late' });
  });

  test('passes the rejection reason through unchanged', async () => {
    const error = new Error('nope');
    const [entry] = await promiseAllSettled([Promise.reject(error)]);
    expect(entry.status).toBe('rejected');
    expect(entry.reason).toBe(error);
  });

  test('each entry has exactly the expected keys, even for undefined values', async () => {
    const [ok, bad] = await promiseAllSettled([Promise.resolve(undefined), Promise.reject(undefined)]);
    expect(Object.keys(ok)).toEqual(['status', 'value']);
    expect(ok.value).toBeUndefined();
    expect(Object.keys(bad)).toEqual(['status', 'reason']);
    expect(bad.reason).toBeUndefined();
  });

  test('does not use the native Promise.allSettled', async () => {
    const spy = jest.spyOn(Promise, 'allSettled');
    try {
      await promiseAllSettled([delay(1, 5), Promise.reject('x')]);
      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });
});
