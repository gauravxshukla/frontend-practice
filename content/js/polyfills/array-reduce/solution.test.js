import myReduce from './solution.js';

beforeAll(() => {
  Array.prototype.myReduce = myReduce;
});
afterAll(() => {
  delete Array.prototype.myReduce;
});

const sum = (acc, n) => acc + n;

describe('Array.prototype.myReduce', () => {
  test('example: sums with an initial value', () => {
    expect([1, 2, 3, 4].myReduce(sum, 0)).toBe(10);
  });

  test('example: without an initial value starts from the first element', () => {
    expect([1, 2, 3, 4].myReduce(sum)).toBe(10);
    expect(['a', 'b'].myReduce((acc, s, i) => acc + s + i, '')).toBe('a0b1');
  });

  test('passes (acc, value, index, array) in order', () => {
    const arr = [10, 20, 30];
    const spy = jest.fn((acc, v) => acc + v);
    arr.myReduce(spy, 0);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, 0, 10, 0, arr);
    expect(spy).toHaveBeenNthCalledWith(2, 10, 20, 1, arr);
    expect(spy).toHaveBeenNthCalledWith(3, 30, 30, 2, arr);
  });

  test('without an initial value the first call gets index 1', () => {
    const spy = jest.fn((acc, v) => acc + v);
    [5, 6, 7].myReduce(spy);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0].slice(0, 3)).toEqual([5, 6, 1]);
  });

  test('throws a TypeError on an empty array with no initial value', () => {
    expect(() => [].myReduce(sum)).toThrow(TypeError);
  });

  test('throws a TypeError on an all-holes array with no initial value', () => {
    expect(() => new Array(3).myReduce(sum)).toThrow(TypeError);
  });

  test('empty array with an initial value returns it without calling back', () => {
    const spy = jest.fn();
    expect([].myReduce(spy, 'seed')).toBe('seed');
    expect(spy).not.toHaveBeenCalled();
  });

  test('an explicit undefined initial value is still an initial value', () => {
    expect([].myReduce(sum, undefined)).toBeUndefined();
    const spy = jest.fn((acc, v) => v);
    [1, 2].myReduce(spy, undefined);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0][0]).toBeUndefined();
  });

  test('falsy initial values (0, "", null) are respected', () => {
    expect([1, 2].myReduce(sum, 0)).toBe(3);
    expect([1, 2].myReduce(sum, '')).toBe('12');
    expect([1].myReduce((acc, v) => [acc, v], null)).toEqual([null, 1]);
  });

  test('a single element with no initial value is returned without calling back', () => {
    const spy = jest.fn();
    expect([42].myReduce(spy)).toBe(42);
    expect(spy).not.toHaveBeenCalled();
  });

  test('skips holes and seeds from the first present index', () => {
    // eslint-disable-next-line no-sparse-arrays
    const arr = [, , 3, , 5];
    const spy = jest.fn((acc, v) => acc + v);
    expect(arr.myReduce(spy)).toBe(8);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0].slice(0, 3)).toEqual([3, 5, 4]);
    expect(arr.myReduce(sum)).toBe(arr.reduce(sum));
  });

  test('throws a TypeError when callbackFn is not a function', () => {
    expect(() => [1, 2].myReduce(null, 0)).toThrow(TypeError);
    expect(() => [1, 2].myReduce('nope')).toThrow(TypeError);
  });

  test('uses the length captured at the start', () => {
    const arr = [1, 2, 3];
    const result = arr.myReduce((acc, v, i, a) => {
      if (i === 0) a.push(100);
      return acc + v;
    }, 0);
    expect(result).toBe(6);
    expect(arr).toEqual([1, 2, 3, 100]);
  });

  test('matches native reduce for building an object', () => {
    const words = ['apple', 'avocado', 'banana'];
    const group = (acc, w) => {
      (acc[w[0]] ||= []).push(w);
      return acc;
    };
    expect(words.myReduce(group, {})).toEqual(words.reduce(group, {}));
  });
});
