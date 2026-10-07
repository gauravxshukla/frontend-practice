import myMap from './solution.js';

beforeAll(() => {
  Array.prototype.myMap = myMap;
});
afterAll(() => {
  delete Array.prototype.myMap;
});

describe('Array.prototype.myMap', () => {
  test('example: doubles every element', () => {
    expect([1, 2, 3].myMap((n) => n * 2)).toEqual([2, 4, 6]);
  });

  test('example: the callback receives the index', () => {
    expect(['a', 'b'].myMap((s, i) => s + i)).toEqual(['a0', 'b1']);
  });

  test('passes value, index and array', () => {
    const arr = [10, 20];
    expect(arr.myMap((v, i, a) => `${v}:${i}:${a === arr}`)).toEqual(['10:0:true', '20:1:true']);
  });

  test('calls the callback once per element, in order', () => {
    const arr = [10, 20, 30];
    const spy = jest.fn((v) => v);
    arr.myMap(spy);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, 10, 0, arr);
    expect(spy).toHaveBeenNthCalledWith(2, 20, 1, arr);
    expect(spy).toHaveBeenNthCalledWith(3, 30, 2, arr);
  });

  test('uses thisArg', () => {
    expect([1, 2].myMap(function (n) { return n * this.factor; }, { factor: 3 })).toEqual([3, 6]);
  });

  test('preserves holes and length', () => {
    let calls = 0;
    // eslint-disable-next-line no-sparse-arrays
    const result = [1, , 3, ,].myMap((n) => { calls++; return n; });
    expect(calls).toBe(2);
    expect(result.length).toBe(4);
    expect(1 in result).toBe(false);
  });

  test('keeps trailing holes of an all-holes array', () => {
    const spy = jest.fn();
    const result = new Array(3).myMap(spy);
    expect(spy).not.toHaveBeenCalled();
    expect(result).toHaveLength(3);
    expect(0 in result).toBe(false);
    expect(2 in result).toBe(false);
  });

  test('an empty array returns a new empty array without calling back', () => {
    const arr = [];
    const spy = jest.fn();
    const result = arr.myMap(spy);
    expect(result).toEqual([]);
    expect(result).not.toBe(arr);
    expect(spy).not.toHaveBeenCalled();
  });

  test('an undefined return value still fills the slot', () => {
    const result = [1, 2].myMap(() => undefined);
    expect(result).toHaveLength(2);
    expect(0 in result).toBe(true);
    expect(result[0]).toBeUndefined();
  });

  test('returns a new array and does not mutate the original', () => {
    const arr = [1, 2, 3];
    const result = arr.myMap((n) => n + 1);
    expect(result).not.toBe(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  test('uses the length captured at the start', () => {
    const arr = [1, 2, 3];
    const spy = jest.fn((v, i, a) => {
      if (i === 0) a.push(100);
      return v * 2;
    });
    expect(arr.myMap(spy)).toEqual([2, 4, 6]);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  test('throws a TypeError when callbackFn is not a function', () => {
    expect(() => [1, 2].myMap(null)).toThrow(TypeError);
    expect(() => [1, 2].myMap('nope')).toThrow(TypeError);
    expect(() => [].myMap(undefined)).toThrow(TypeError);
  });
});
