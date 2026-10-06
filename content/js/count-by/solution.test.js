import countBy from './solution.js';

describe('countBy', () => {
  test('empty array', () => {
    expect(countBy([], Math.floor)).toEqual({});
  });

  test('Math.floor', () => {
    expect(countBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ 4: 1, 6: 2 });
  });

  test('custom iteratee', () => {
    expect(countBy(['one', 'two', 'three'], (s) => s.length)).toEqual({ 3: 2, 5: 1 });
  });

  test('keys that exist on Object.prototype', () => {
    expect(countBy(['constructor', 'constructor'], (s) => s)).toEqual({ constructor: 2 });
  });
});
