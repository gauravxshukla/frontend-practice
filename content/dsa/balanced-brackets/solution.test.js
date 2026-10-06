import isBalanced from './solution.js';

describe('isBalanced', () => {
  test('empty string', () => {
    expect(isBalanced('')).toBe(true);
  });

  test('balanced', () => {
    expect(isBalanced('()')).toBe(true);
    expect(isBalanced('([]{})')).toBe(true);
    expect(isBalanced('{[()()]}')).toBe(true);
  });

  test('wrong order', () => {
    expect(isBalanced('([)]')).toBe(false);
  });

  test('unclosed or unopened', () => {
    expect(isBalanced('((')).toBe(false);
    expect(isBalanced('))')).toBe(false);
    expect(isBalanced('())')).toBe(false);
  });
});
