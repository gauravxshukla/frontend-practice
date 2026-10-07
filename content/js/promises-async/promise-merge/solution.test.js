import promiseMerge from './solution.js';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

describe('promiseMerge', () => {
  test('example: adds two numbers', async () => {
    await expect(promiseMerge(Promise.resolve(1), Promise.resolve(2))).resolves.toBe(3);
  });

  test('example: shallow-merges two plain objects', async () => {
    await expect(promiseMerge(Promise.resolve({ a: 1 }), Promise.resolve({ b: 2 }))).resolves.toEqual({ a: 1, b: 2 });
  });

  test('example: mismatched types reject with a TypeError', async () => {
    await expect(promiseMerge(Promise.resolve(1), Promise.resolve('1'))).rejects.toThrow(TypeError);
    await expect(promiseMerge(Promise.resolve(1), Promise.resolve('1'))).rejects.toThrow('Unsupported data types');
  });

  test('concatenates two strings', async () => {
    await expect(promiseMerge(delay('foo', 10), Promise.resolve('bar'))).resolves.toBe('foobar');
  });

  test('concatenates two arrays', async () => {
    await expect(promiseMerge(Promise.resolve([1, 2]), delay([3, [4]], 5))).resolves.toEqual([1, 2, 3, [4]]);
  });

  test('keys from the second object win, and the merge is shallow', async () => {
    const result = await promiseMerge(Promise.resolve({ a: 1, nested: { x: 1 } }), Promise.resolve({ a: 2, nested: { y: 2 } }));
    expect(result).toEqual({ a: 2, nested: { y: 2 } });
  });

  test('an array and an object are a mismatch', async () => {
    await expect(promiseMerge(Promise.resolve([1]), Promise.resolve({ 0: 1 }))).rejects.toThrow('Unsupported data types');
  });

  test('unsupported types of the same kind reject', async () => {
    await expect(promiseMerge(Promise.resolve(true), Promise.resolve(false))).rejects.toThrow('Unsupported data types');
    await expect(promiseMerge(Promise.resolve(null), Promise.resolve(null))).rejects.toThrow(TypeError);
    await expect(promiseMerge(Promise.resolve(undefined), Promise.resolve(undefined))).rejects.toThrow(TypeError);
  });

  test('rejects with the error when either promise rejects', async () => {
    const error = new Error('first failed');
    let received;
    try {
      await promiseMerge(Promise.reject(error), Promise.resolve(1));
    } catch (e) {
      received = e;
    }
    expect(received).toBe(error);
    await expect(promiseMerge(Promise.resolve(1), Promise.reject(new Error('second failed')))).rejects.toThrow('second failed');
  });

  test('accepts plain values as well as promises', async () => {
    await expect(promiseMerge(10, Promise.resolve(5))).resolves.toBe(15);
  });

  test('does not mutate the inputs', async () => {
    const left = [1];
    const right = [2];
    const objA = { a: 1 };
    const objB = { b: 2 };
    const arr = await promiseMerge(Promise.resolve(left), Promise.resolve(right));
    const obj = await promiseMerge(Promise.resolve(objA), Promise.resolve(objB));
    expect(left).toEqual([1]);
    expect(objA).toEqual({ a: 1 });
    expect(arr).not.toBe(left);
    expect(obj).not.toBe(objA);
  });

  test('waits for both promises in parallel', async () => {
    const start = Date.now();
    await expect(promiseMerge(delay(1, 40), delay(2, 40))).resolves.toBe(3);
    expect(Date.now() - start).toBeLessThan(75);
  });
});
