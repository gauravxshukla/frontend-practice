import maxProduct from './solution.js';

describe('maxProduct', () => {
  test('positive run', () => {
    expect(maxProduct([2, 3, -2, 4])).toBe(6);
  });

  test('zero splits', () => {
    expect(maxProduct([-2, 0, -1])).toBe(0);
  });

  test('two negatives make a positive', () => {
    expect(maxProduct([-2, 3, -4])).toBe(24);
  });

  test('single negative element', () => {
    expect(maxProduct([-3])).toBe(-3);
  });

  test('zeros between runs', () => {
    expect(maxProduct([0, 2, -1, 0, 3, 4])).toBe(12);
  });
});
