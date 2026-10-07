import getType from './solution.js';

describe('getType', () => {
  test('example: null, arrays and dates are distinguished from objects', () => {
    expect(getType(null)).toBe('null');
    expect(getType([1, 2])).toBe('array');
    expect(getType(new Date())).toBe('date');
    expect(getType({ a: 1 })).toBe('object');
  });

  test('example: async functions and class instances', () => {
    expect(getType(async () => {})).toBe('function');
    expect(getType(new (class Foo {})())).toBe('object');
  });

  test.each([
    [undefined, 'undefined'],
    [true, 'boolean'],
    [0, 'number'],
    [NaN, 'number'],
    [Infinity, 'number'],
    ['', 'string'],
    [10n, 'bigint'],
    [Symbol('s'), 'symbol'],
  ])('primitive %s -> %s', (value, expected) => {
    expect(getType(value)).toBe(expected);
  });

  test('every kind of function is "function"', () => {
    expect(getType(function () {})).toBe('function');
    expect(getType(() => {})).toBe('function');
    expect(getType(function* () {})).toBe('function');
    expect(getType(async function* () {})).toBe('function');
    expect(getType(class {})).toBe('function');
  });

  test('regexp, map and set', () => {
    expect(getType(/abc/g)).toBe('regexp');
    expect(getType(new RegExp('x'))).toBe('regexp');
    expect(getType(new Map())).toBe('map');
    expect(getType(new Set([1]))).toBe('set');
  });

  test('empty array and empty object', () => {
    expect(getType([])).toBe('array');
    expect(getType({})).toBe('object');
  });

  test('Object.create(null) is "object" and does not crash', () => {
    expect(getType(Object.create(null))).toBe('object');
  });

  test('class instances are "object", even with a custom name', () => {
    class Point {
      constructor(x) {
        this.x = x;
      }
    }
    expect(getType(new Point(1))).toBe('object');
  });
});
