import countBy from './solution.js';

describe('countBy', () => {
  test('example: Math.floor', () => {
    expect(countBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ 4: 1, 6: 2 });
  });

  test('example: custom iteratee', () => {
    expect(countBy(['one', 'two', 'three'], (s) => s.length)).toEqual({ 3: 2, 5: 1 });
  });

  test('empty array', () => {
    expect(countBy([], Math.floor)).toEqual({});
  });

  test('keys that exist on Object.prototype', () => {
    expect(countBy(['constructor', 'constructor'], (s) => s)).toEqual({ constructor: 2 });
  });

  test('more inherited names: toString and hasOwnProperty', () => {
    expect(countBy(['toString', 'hasOwnProperty', 'toString'], (s) => s)).toEqual({
      toString: 2,
      hasOwnProperty: 1,
    });
  });

  test('calls the iteratee once per element, in order', () => {
    const iteratee = jest.fn((x) => x > 1);
    countBy([3, 1, 2], iteratee);
    expect(iteratee).toHaveBeenCalledTimes(3);
    expect(iteratee.mock.calls.map((args) => args[0])).toEqual([3, 1, 2]);
  });

  test('keys are converted to strings', () => {
    expect(countBy([1, 2, 3, 4, 5], (n) => n % 2 === 0)).toEqual({ false: 3, true: 2 });
    expect(countBy(['a', 'b'], () => undefined)).toEqual({ undefined: 2 });
    expect(Object.keys(countBy([7], (n) => n))).toEqual(['7']);
  });

  test('counts are numbers that add up to the input length', () => {
    const input = ['a', 'b', 'a', 'c', 'a', 'b'];
    const result = countBy(input, (s) => s);
    expect(result).toEqual({ a: 3, b: 2, c: 1 });
    expect(typeof result.a).toBe('number');
    expect(Object.values(result).reduce((sum, n) => sum + n, 0)).toBe(input.length);
  });

  test('does not mutate the input', () => {
    const input = [{ t: 'a' }, { t: 'b' }, { t: 'a' }];
    countBy(input, (x) => x.t);
    expect(input).toEqual([{ t: 'a' }, { t: 'b' }, { t: 'a' }]);
  });

  test('returns a new object on every call', () => {
    const first = countBy([1], (x) => x);
    const second = countBy([1], (x) => x);
    expect(first).not.toBe(second);
    expect(second).toEqual({ 1: 1 });
  });
});
