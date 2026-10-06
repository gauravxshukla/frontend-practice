import groupBy from './solution.js';

describe('groupBy', () => {
  test('empty array', () => {
    expect(groupBy([], Math.floor)).toEqual({});
  });

  test('Math.floor keeps original order', () => {
    expect(groupBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ 4: [4.2], 6: [6.1, 6.3] });
  });

  test('custom iteratee', () => {
    expect(groupBy(['one', 'two', 'three'], (s) => s.length)).toEqual({ 3: ['one', 'two'], 5: ['three'] });
  });

  test('objects', () => {
    const a = { n: 'a', age: 1 };
    const b = { n: 'b', age: 2 };
    const c = { n: 'c', age: 1 };
    expect(groupBy([a, b, c], (u) => u.age)).toEqual({ 1: [a, c], 2: [b] });
  });
});
