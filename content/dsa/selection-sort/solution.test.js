import selectionSort from './solution.js';

describe('selectionSort', () => {
  test('empty and single', () => {
    expect(selectionSort([])).toEqual([]);
    expect(selectionSort([1])).toEqual([1]);
  });

  test('unsorted', () => {
    expect(selectionSort([5, 2, 9, 1, 5, 6])).toEqual([1, 2, 5, 5, 6, 9]);
  });

  test('already sorted and reversed', () => {
    expect(selectionSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    expect(selectionSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]);
  });

  test('negatives', () => {
    expect(selectionSort([0, -1, 3, -10])).toEqual([-10, -1, 0, 3]);
  });

  test('sorts in place and returns the same array', () => {
    const arr = [3, 1, 2];
    expect(selectionSort(arr)).toBe(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
});
