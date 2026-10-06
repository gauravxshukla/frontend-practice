import merge from './solution.js';

describe('merge intervals', () => {
  test('empty', () => {
    expect(merge([])).toEqual([]);
  });

  test('overlapping', () => {
    expect(merge([[1, 3], [2, 6], [8, 10], [15, 18]])).toEqual([[1, 6], [8, 10], [15, 18]]);
  });

  test('touching', () => {
    expect(merge([[1, 4], [4, 5]])).toEqual([[1, 5]]);
  });

  test('unsorted input and containment', () => {
    expect(merge([[2, 3], [1, 10], [11, 12]])).toEqual([[1, 10], [11, 12]]);
  });

  test('does not mutate input', () => {
    const input = [[2, 6], [1, 3]];
    merge(input);
    expect(input).toEqual([[2, 6], [1, 3]]);
  });
});
