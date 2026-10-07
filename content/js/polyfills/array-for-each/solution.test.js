import myForEach from './solution.js';

beforeAll(() => {
  Array.prototype.myForEach = myForEach;
});
afterAll(() => {
  delete Array.prototype.myForEach;
});

describe('Array.prototype.myForEach', () => {
  test('example: visits every element in order', () => {
    const seen = [];
    [1, 2, 3].myForEach((n, i) => seen.push(n * 10 + i));
    expect(seen).toEqual([10, 21, 32]);
  });

  test('example: returns undefined', () => {
    expect([1, 2, 3].myForEach((n) => n * 2)).toBeUndefined();
  });

  test('passes value, index and array', () => {
    const arr = ['a', 'b'];
    const spy = jest.fn();
    arr.myForEach(spy);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, 'a', 0, arr);
    expect(spy).toHaveBeenNthCalledWith(2, 'b', 1, arr);
  });

  test('uses thisArg', () => {
    const ctx = { total: 0 };
    [1, 2, 3].myForEach(function (n) {
      this.total += n;
    }, ctx);
    expect(ctx.total).toBe(6);
  });

  test('skips holes', () => {
    const spy = jest.fn();
    // eslint-disable-next-line no-sparse-arrays
    [1, , 3, ,].myForEach(spy);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls.map((c) => c[1])).toEqual([0, 2]);
  });

  test('visits explicit undefined values (they are not holes)', () => {
    const spy = jest.fn();
    [undefined, null].myForEach(spy);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('does not visit elements appended during iteration', () => {
    const arr = [1, 2];
    const spy = jest.fn((v, i, a) => a.push(v));
    arr.myForEach(spy);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(arr).toEqual([1, 2, 1, 2]);
  });

  test('skips elements deleted before they are reached', () => {
    const arr = [1, 2, 3];
    const spy = jest.fn((v, i, a) => {
      if (i === 0) delete a[1];
    });
    arr.myForEach(spy);
    expect(spy.mock.calls.map((c) => c[0])).toEqual([1, 3]);
  });

  test('does nothing on an empty array', () => {
    const spy = jest.fn();
    expect([].myForEach(spy)).toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });

  test('throws a TypeError when callbackFn is not a function', () => {
    expect(() => [1].myForEach(undefined)).toThrow(TypeError);
  });
});
