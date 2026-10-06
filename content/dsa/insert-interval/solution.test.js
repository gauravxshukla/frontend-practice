import insert from './solution.js';

describe('insert interval', () => {
  test('into empty list', () => {
    expect(insert([], [5, 7])).toEqual([[5, 7]]);
  });

  test('merges with one interval', () => {
    expect(insert([[1, 3], [6, 9]], [2, 5])).toEqual([[1, 5], [6, 9]]);
  });

  test('merges across several intervals', () => {
    expect(insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8])).toEqual([[1, 2], [3, 10], [12, 16]]);
  });

  test('goes at the start or the end', () => {
    expect(insert([[3, 4]], [1, 2])).toEqual([[1, 2], [3, 4]]);
    expect(insert([[1, 2]], [3, 4])).toEqual([[1, 2], [3, 4]]);
  });

  test('touching merges', () => {
    expect(insert([[1, 5]], [5, 7])).toEqual([[1, 7]]);
  });
});
