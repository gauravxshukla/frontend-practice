import containsDuplicate from './solution.js';

describe('containsDuplicate', () => {
  test('has duplicate', () => {
    expect(containsDuplicate([1, 2, 3, 1])).toBe(true);
  });

  test('all unique', () => {
    expect(containsDuplicate([1, 2, 3, 4])).toBe(false);
  });

  test('empty and single', () => {
    expect(containsDuplicate([])).toBe(false);
    expect(containsDuplicate([7])).toBe(false);
  });
});
