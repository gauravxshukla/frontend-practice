import trap from './solution.js';

describe('trap', () => {
  test('classic example', () => {
    expect(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])).toBe(6);
  });

  test('second example', () => {
    expect(trap([4, 2, 0, 3, 2, 5])).toBe(9);
  });

  test('no water', () => {
    expect(trap([])).toBe(0);
    expect(trap([1, 2, 3])).toBe(0);
    expect(trap([3, 2, 1])).toBe(0);
  });

  test('simple basin', () => {
    expect(trap([3, 0, 3])).toBe(3);
  });
});
