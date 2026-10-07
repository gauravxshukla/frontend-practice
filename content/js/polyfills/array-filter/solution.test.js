import myFilter from './solution.js';

beforeAll(() => {
  Array.prototype.myFilter = myFilter;
});
afterAll(() => {
  delete Array.prototype.myFilter;
});

describe('Array.prototype.myFilter', () => {
  test('example: keeps the even numbers', () => {
    expect([1, 2, 3, 4].myFilter((n) => n % 2 === 0)).toEqual([2, 4]);
  });

  test('example: the callback receives the index', () => {
    expect(['a', 'b', 'c'].myFilter((s, i) => i !== 1)).toEqual(['a', 'c']);
  });

  test('passes value, index and array', () => {
    const arr = ['a', 'b'];
    const calls = [];
    arr.myFilter((v, i, a) => calls.push([v, i, a === arr]));
    expect(calls).toEqual([['a', 0, true], ['b', 1, true]]);
  });

  test('uses thisArg', () => {
    const ctx = { min: 2 };
    expect([1, 2, 3].myFilter(function (n) { return n >= this.min; }, ctx)).toEqual([2, 3]);
  });

  test('skips holes in sparse arrays', () => {
    let calls = 0;
    // eslint-disable-next-line no-sparse-arrays
    [1, , 3].myFilter(() => { calls++; return true; });
    expect(calls).toBe(2);
  });

  test('the result is dense even when the input has holes', () => {
    // eslint-disable-next-line no-sparse-arrays
    const result = [1, , 3, ,].myFilter(() => true);
    expect(result).toEqual([1, 3]);
    expect(result).toHaveLength(2);
  });

  test('does not mutate the original', () => {
    const arr = [1, 2, 3];
    arr.myFilter(() => false);
    expect(arr).toEqual([1, 2, 3]);
  });

  test('keeps the original elements, using truthiness of the callback result', () => {
    const items = [1, 0, 'a', '', null, { id: 1 }];
    const result = items.myFilter((x) => x);
    expect(result).toEqual([1, 'a', { id: 1 }]);
    expect(result[2]).toBe(items[5]);
    expect([5, 6].myFilter(() => 'yes')).toEqual([5, 6]);
  });

  test('returns a new array even when every element is kept', () => {
    const arr = [1, 2];
    const result = arr.myFilter(() => true);
    expect(result).toEqual([1, 2]);
    expect(result).not.toBe(arr);
  });

  test('an empty array returns [] without calling back', () => {
    const spy = jest.fn();
    expect([].myFilter(spy)).toEqual([]);
    expect(spy).not.toHaveBeenCalled();
  });

  test('uses the length captured at the start', () => {
    const arr = [1, 2, 3];
    const spy = jest.fn((v, i, a) => {
      if (i === 0) a.push(100);
      return true;
    });
    expect(arr.myFilter(spy)).toEqual([1, 2, 3]);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  test('throws a TypeError when callbackFn is not a function', () => {
    expect(() => [1, 2].myFilter(null)).toThrow(TypeError);
    expect(() => [1, 2].myFilter({})).toThrow(TypeError);
    expect(() => [].myFilter(undefined)).toThrow(TypeError);
  });
});
