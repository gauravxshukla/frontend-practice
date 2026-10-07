import flattenObject from './solution.js';

describe('flattenObject', () => {
  test('example: nested objects and arrays become dotted paths', () => {
    expect(flattenObject({ a: { b: 1, c: { d: 2 } }, e: [1, { f: 3 }] })).toEqual({
      'a.b': 1,
      'a.c.d': 2,
      'e.0': 1,
      'e.1.f': 3,
    });
  });

  test('example: empty containers and null are kept as values', () => {
    const result = flattenObject({ a: {}, b: [], c: null });
    expect(Object.keys(result).sort()).toEqual(['a', 'b', 'c']);
    expect(result.a).toEqual({});
    expect(Array.isArray(result.b)).toBe(true);
    expect(result.b).toHaveLength(0);
    expect(result.c).toBeNull();
  });

  test('custom separator', () => {
    expect(flattenObject({ a: { b: 1, c: [2] } }, '/')).toEqual({ 'a/b': 1, 'a/c/0': 2 });
  });

  test('already-flat objects are unchanged', () => {
    expect(flattenObject({ x: 1, y: 'two', z: false })).toEqual({ x: 1, y: 'two', z: false });
  });

  test('empty object returns an empty object', () => {
    expect(flattenObject({})).toEqual({});
  });

  test('deeply nested empty containers keep their full path', () => {
    const result = flattenObject({ a: { b: { c: {} } }, d: [[]] });
    expect(Object.keys(result).sort()).toEqual(['a.b.c', 'd.0']);
    expect(result['a.b.c']).toEqual({});
    expect(Array.isArray(result['d.0'])).toBe(true);
  });

  test('undefined, functions and dates are leaves', () => {
    const date = new Date(0);
    const fn = () => 1;
    const result = flattenObject({ a: { u: undefined, fn, date } });
    expect(Object.keys(result).sort()).toEqual(['a.date', 'a.fn', 'a.u']);
    expect(result['a.date']).toBe(date);
    expect(result['a.fn']).toBe(fn);
    expect(result['a.u']).toBeUndefined();
  });

  test('nested arrays use index keys at every level', () => {
    expect(flattenObject({ m: [[1, 2], [3]] })).toEqual({ 'm.0.0': 1, 'm.0.1': 2, 'm.1.0': 3 });
  });

  test('does not mutate the input', () => {
    const input = { a: { b: [1, { c: 2 }] } };
    flattenObject(input);
    expect(input).toEqual({ a: { b: [1, { c: 2 }] } });
  });
});
