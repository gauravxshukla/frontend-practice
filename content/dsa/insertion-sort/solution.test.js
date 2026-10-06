import insertionSort from './solution.js';

describe('insertionSort', () => {
  test('empty and single', () => {
    expect(insertionSort([])).toEqual([]);
    expect(insertionSort([1])).toEqual([1]);
  });

  test('unsorted', () => {
    expect(insertionSort([5, 2, 9, 1, 5, 6])).toEqual([1, 2, 5, 5, 6, 9]);
  });

  test('already sorted and reversed', () => {
    expect(insertionSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(insertionSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]);
  });

  test('negatives', () => {
    expect(insertionSort([0, -1, 3, -10])).toEqual([-10, -1, 0, 3]);
  });

  test('sorts in place and returns the same array', () => {
    const arr = [3, 1, 2];
    expect(insertionSort(arr)).toBe(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
});
