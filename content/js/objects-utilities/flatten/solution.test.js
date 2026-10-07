import flatten from './solution.js';

describe('flatten', () => {
  test('example: deeply nested', () => {
    expect(flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5]);
  });

  test('example: empty arrays disappear', () => {
    expect(flatten([[], [[]], 1, [[[]]]])).toEqual([1]);
  });

  test('already flat', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('keeps objects as items', () => {
    const obj = { a: [1] };
    expect(flatten([obj, [obj]])).toEqual([obj, obj]);
  });

  test('does not mutate input', () => {
    const input = [1, [2, [3]]];
    flatten(input);
    expect(input).toEqual([1, [2, [3]]]);
  });

  test('always returns a new array', () => {
    const flat = [1, 2];
    expect(flatten(flat)).not.toBe(flat);
    expect(flatten([])).toEqual([]);
  });

  test('preserves order across mixed depths', () => {
    expect(flatten([[1, [2]], 3, [[4], 5], [[[6]]]])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('holes become undefined; null and undefined are kept', () => {
    const result = flatten([1, , [2, , 3], null, undefined]);
    expect(result).toHaveLength(7);
    expect(result).toEqual([1, undefined, 2, undefined, 3, null, undefined]);
  });

  test('strings and array-like objects are not flattened', () => {
    const arrayLike = { length: 1, 0: 'x' };
    const result = flatten(['ab', [arrayLike]]);
    expect(result).toEqual(['ab', arrayLike]);
    expect(result[1]).toBe(arrayLike);
  });

  test('handles 500 levels of nesting', () => {
    let nested = [500];
    for (let i = 499; i >= 0; i--) nested = [i, nested];
    const result = flatten(nested);
    expect(result).toHaveLength(501);
    expect(result[0]).toBe(0);
    expect(result[500]).toBe(500);
  });

  test('does not use Array.prototype.flat', () => {
    const spy = jest.spyOn(Array.prototype, 'flat');
    try {
      flatten([1, [2, [3]]]);
    } finally {
      spy.mockRestore();
    }
    expect(spy).not.toHaveBeenCalled();
  });
});
