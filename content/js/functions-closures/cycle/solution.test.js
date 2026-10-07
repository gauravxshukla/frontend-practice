import cycle from './solution.js';

const take = (fn, n) => Array.from({ length: n }, () => fn());

describe('cycle', () => {
  test('example: two values act as a toggle', () => {
    const toggle = cycle('on', 'off');
    expect(take(toggle, 5)).toEqual(['on', 'off', 'on', 'off', 'on']);
  });

  test('example: wraps around after the last value', () => {
    const step = cycle(1, 2, 3);
    expect(take(step, 7)).toEqual([1, 2, 3, 1, 2, 3, 1]);
  });

  test('a single value is always returned', () => {
    const only = cycle('x');
    expect(take(only, 4)).toEqual(['x', 'x', 'x', 'x']);
  });

  test('instances are independent', () => {
    const a = cycle('a', 'b', 'c');
    const b = cycle('a', 'b', 'c');
    a();
    a();
    expect(b()).toBe('a');
    expect(a()).toBe('c');
    expect(b()).toBe('b');
  });

  test('handles falsy values', () => {
    const fn = cycle(0, undefined, null, false, '');
    expect(take(fn, 6)).toEqual([0, undefined, null, false, '', 0]);
  });

  test('returns object values by reference', () => {
    const first = { id: 1 };
    const second = { id: 2 };
    const fn = cycle(first, second);
    expect(fn()).toBe(first);
    expect(fn()).toBe(second);
    expect(fn()).toBe(first);
  });

  test('ignores arguments passed to the returned function', () => {
    const fn = cycle('a', 'b');
    expect(fn('z')).toBe('a');
    expect(fn(99)).toBe('b');
  });
});
