import promiseTimeout from './solution.js';

const resolveAfter = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const rejectAfter = (reason, ms) => new Promise((_, reject) => setTimeout(() => reject(reason), ms));

describe('promiseTimeout', () => {
  test('example: rejects with Timeout when the promise is too slow', async () => {
    await expect(promiseTimeout(resolveAfter('late', 100), 20)).rejects.toThrow('Timeout');
  });

  test('example: resolves with the value when the promise is fast enough', async () => {
    await expect(promiseTimeout(resolveAfter('user', 10), 100)).resolves.toBe('user');
  });

  test('the timeout reason is an Error with message exactly "Timeout"', async () => {
    let error;
    try {
      await promiseTimeout(new Promise(() => {}), 10);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Timeout');
  });

  test('passes a rejection through unchanged', async () => {
    const original = new Error('network down');
    let error;
    try {
      await promiseTimeout(rejectAfter(original, 5), 100);
    } catch (e) {
      error = e;
    }
    expect(error).toBe(original);
  });

  test('accepts a function that returns the promise and calls it once', async () => {
    const fn = jest.fn(() => resolveAfter(7, 5));
    await expect(promiseTimeout(fn, 100)).resolves.toBe(7);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('a function that throws synchronously rejects with that error', async () => {
    const fn = () => {
      throw new Error('sync fail');
    };
    await expect(promiseTimeout(fn, 100)).rejects.toThrow('sync fail');
  });

  test('accepts a plain value', async () => {
    await expect(promiseTimeout(42, 50)).resolves.toBe(42);
  });

  test('rejects at about ms, without waiting for a never-settling promise', async () => {
    const start = Date.now();
    await expect(promiseTimeout(new Promise(() => {}), 30)).rejects.toThrow('Timeout');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(25);
    expect(elapsed).toBeLessThan(200);
  });

  test('clears the timer when the promise settles first', async () => {
    const spy = jest.spyOn(globalThis, 'clearTimeout');
    try {
      await promiseTimeout(resolveAfter('ok', 5), 1000);
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  test('clears the timer when the promise rejects first', async () => {
    const spy = jest.spyOn(globalThis, 'clearTimeout');
    try {
      await promiseTimeout(rejectAfter(new Error('bad'), 5), 1000).catch(() => {});
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });
});
