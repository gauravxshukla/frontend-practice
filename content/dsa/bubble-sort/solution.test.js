import bubbleSort from './solution.js';

describe('bubbleSort', () => {
  test('empty and single', () => {
    expect(bubbleSort([])).toEqual([]);
    expect(bubbleSort([1])).toEqual([1]);
  });

  test('unsorted', () => {
    expect(bubbleSort([5, 2, 9, 1, 5, 6])).toEqual([1, 2, 5, 5, 6, 9]);
  });

  test('already sorted and reversed', () => {
    expect(bubbleSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(bubbleSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]);
  });

  test('negatives', () => {
    expect(bubbleSort([0, -1, 3, -10])).toEqual([-10, -1, 0, 3]);
  });

  test('sorts in place and returns the same array', () => {
    const arr = [3, 1, 2];
    expect(bubbleSort(arr)).toBe(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
});
