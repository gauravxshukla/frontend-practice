import maxProfit from './solution.js';

describe('maxProfit', () => {
  test('profit exists', () => {
    expect(maxProfit([7, 1, 5, 3, 6, 4])).toBe(5);
  });

  test('only falling prices', () => {
    expect(maxProfit([7, 6, 4, 3, 1])).toBe(0);
  });

  test('empty and single day', () => {
    expect(maxProfit([])).toBe(0);
    expect(maxProfit([5])).toBe(0);
  });

  test('minimum comes after an earlier peak', () => {
    expect(maxProfit([3, 8, 1, 4])).toBe(5);
  });
});
