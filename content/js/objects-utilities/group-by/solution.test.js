import groupBy from './solution.js';

describe('groupBy', () => {
  test('example: Math.floor keeps original order', () => {
    expect(groupBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ 4: [4.2], 6: [6.1, 6.3] });
  });

  test('example: custom iteratee', () => {
    expect(groupBy(['one', 'two', 'three'], (s) => s.length)).toEqual({ 3: ['one', 'two'], 5: ['three'] });
  });

  test('empty array', () => {
    expect(groupBy([], Math.floor)).toEqual({});
  });

  test('objects', () => {
    const a = { n: 'a', age: 1 };
    const b = { n: 'b', age: 2 };
    const c = { n: 'c', age: 1 };
    expect(groupBy([a, b, c], (u) => u.age)).toEqual({ 1: [a, c], 2: [b] });
  });

  test('grouped items are the original references', () => {
    const a = { age: 1 };
    const b = { age: 1 };
    const result = groupBy([a, b], (u) => u.age);
    expect(result[1][0]).toBe(a);
    expect(result[1][1]).toBe(b);
  });

  test('calls the iteratee once per element, in order', () => {
    const iteratee = jest.fn((x) => x % 2);
    groupBy([3, 1, 2], iteratee);
    expect(iteratee).toHaveBeenCalledTimes(3);
    expect(iteratee.mock.calls.map((args) => args[0])).toEqual([3, 1, 2]);
  });

  test('keys are converted to strings', () => {
    expect(groupBy([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual({ false: [1, 3], true: [2, 4] });
    expect(groupBy(['a', 'b'], () => undefined)).toEqual({ undefined: ['a', 'b'] });
    expect(Object.keys(groupBy([1], (n) => n))).toEqual(['1']);
  });

  test('keys that exist on Object.prototype', () => {
    expect(groupBy(['constructor', 'toString', 'constructor'], (s) => s)).toEqual({
      constructor: ['constructor', 'constructor'],
      toString: ['toString'],
    });
  });

  test('duplicates are all kept', () => {
    expect(groupBy([1, 1, 2, 1], (x) => x)).toEqual({ 1: [1, 1, 1], 2: [2] });
  });

  test('does not mutate the input', () => {
    const input = [{ t: 'a' }, { t: 'b' }, { t: 'a' }];
    groupBy(input, (x) => x.t);
    expect(input).toEqual([{ t: 'a' }, { t: 'b' }, { t: 'a' }]);
  });

  test('returns a new object on every call', () => {
    const first = groupBy([1], (x) => x);
    const second = groupBy([1], (x) => x);
    expect(first).not.toBe(second);
    first[1].push(99);
    expect(second).toEqual({ 1: [1] });
  });
});
