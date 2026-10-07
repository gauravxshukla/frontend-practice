import difference from './solution.js';

describe('difference', () => {
  test('example: removes values found in the exclude array', () => {
    expect(difference([2, 1, 2, 3], [2])).toEqual([1, 3]);
  });

  test('example: accepts several exclude arrays', () => {
    expect(difference([1, 2, 3, 4, 5], [1, 2], [5])).toEqual([3, 4]);
  });

  test('NaN matches NaN', () => {
    expect(difference([1, NaN, 3], [NaN])).toEqual([1, 3]);
  });

  test('keeps the order and duplicates of the first array', () => {
    expect(difference([3, 1, 3, 2, 1], [2])).toEqual([3, 1, 3, 1]);
  });

  test('objects are compared by reference', () => {
    const a = { id: 1 };
    const b = { id: 1 };
    const result = difference([a, b], [a]);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(b);
  });

  test('uses strict equality apart from NaN', () => {
    expect(difference([1, '1', 0, null, undefined], [1, false])).toEqual(['1', 0, null, undefined]);
  });

  test('no exclude arrays returns a new copy', () => {
    const input = [1, 2];
    const result = difference(input);
    expect(result).toEqual([1, 2]);
    expect(result).not.toBe(input);
  });

  test('empty inputs', () => {
    expect(difference([], [1, 2])).toEqual([]);
    expect(difference([1, 2], [])).toEqual([1, 2]);
  });

  test('does not mutate the inputs', () => {
    const input = [1, 2, 3];
    const exclude = [2];
    difference(input, exclude);
    expect(input).toEqual([1, 2, 3]);
    expect(exclude).toEqual([2]);
  });
});
