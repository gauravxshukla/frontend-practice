import twoSum from './solution.js';

describe('twoSum', () => {
  test('basic', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
  });

  test('pair not at the start', () => {
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
  });

  test('duplicate values', () => {
    expect(twoSum([3, 3], 6)).toEqual([0, 1]);
  });

  test('negatives', () => {
    expect(twoSum([-3, 4, 3, 90], 0)).toEqual([0, 2]);
  });
});
