import unique from './solution.js';

describe('unique', () => {
  test('example: keeps the first occurrence of each value', () => {
    expect(unique([2, 1, 2, 3, 1])).toEqual([2, 1, 3]);
  });

  test('example: NaN is deduplicated', () => {
    const result = unique([NaN, 1, NaN]);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeNaN();
    expect(result[1]).toBe(1);
  });

  test('different types are not equal', () => {
    expect(unique([1, '1', 1, true, 'true'])).toEqual([1, '1', true, 'true']);
  });

  test('objects are compared by reference', () => {
    const a = { id: 1 };
    const result = unique([a, { id: 1 }, a]);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(a);
  });

  test('null and undefined are kept once each', () => {
    expect(unique([null, undefined, null, undefined])).toEqual([null, undefined]);
  });

  test('empty array', () => {
    expect(unique([])).toEqual([]);
  });

  test('returns a new array and does not mutate the input', () => {
    const input = [1, 1, 2];
    const result = unique(input);
    expect(input).toEqual([1, 1, 2]);
    expect(unique([1, 2])).not.toBe(input);
    expect(result).not.toBe(input);
  });
});
