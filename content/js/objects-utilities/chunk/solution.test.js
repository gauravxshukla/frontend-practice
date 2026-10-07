import chunk from './solution.js';

describe('chunk', () => {
  test('example: splits into equal groups', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  test('example: the last group may be shorter', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('size defaults to 1', () => {
    expect(chunk([1, 2, 3])).toEqual([[1], [2], [3]]);
  });

  test('size larger than the array gives one group', () => {
    expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
  });

  test('size < 1 returns an empty array', () => {
    expect(chunk([1, 2, 3], 0)).toEqual([]);
    expect(chunk([1, 2, 3], -2)).toEqual([]);
    expect(chunk([1, 2, 3], 0.5)).toEqual([]);
  });

  test('fractional sizes are floored', () => {
    expect(chunk([1, 2, 3, 4, 5], 2.7)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('empty array returns an empty array', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  test('does not mutate the input and groups are new arrays', () => {
    const input = [1, 2, 3, 4];
    const result = chunk(input, 4);
    expect(input).toEqual([1, 2, 3, 4]);
    expect(result[0]).not.toBe(input);
  });
});
