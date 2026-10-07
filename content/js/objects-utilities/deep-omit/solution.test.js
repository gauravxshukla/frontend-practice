import deepOmit from './solution.js';

describe('deepOmit', () => {
  test('example: removes keys at every depth, including inside arrays', () => {
    expect(deepOmit({ a: 1, b: { a: 2, c: 3 }, list: [{ a: 4, d: 5 }] }, ['a'])).toEqual({
      b: { c: 3 },
      list: [{ d: 5 }],
    });
  });

  test('example: arrays at the top level and primitives', () => {
    expect(deepOmit([{ password: 'x', name: 'Ada' }], ['password'])).toEqual([{ name: 'Ada' }]);
    expect(deepOmit(42, ['a'])).toBe(42);
  });

  test('primitives, null and undefined are returned as is', () => {
    expect(deepOmit('str', ['a'])).toBe('str');
    expect(deepOmit(null, ['a'])).toBeNull();
    expect(deepOmit(undefined, ['a'])).toBeUndefined();
  });

  test('omits several keys and whole subtrees', () => {
    const input = { secret: { deep: { x: 1 } }, token: 't', keep: { token: 'u', ok: true } };
    expect(deepOmit(input, ['secret', 'token'])).toEqual({ keep: { ok: true } });
  });

  test('nested arrays of arrays of objects', () => {
    expect(deepOmit({ grid: [[{ id: 1, tmp: 0 }], [{ tmp: 1 }]] }, ['tmp'])).toEqual({
      grid: [[{ id: 1 }], [{}]],
    });
  });

  test('array indexes are not treated as keys', () => {
    expect(deepOmit(['a', 'b'], ['0'])).toEqual(['a', 'b']);
  });

  test('non-plain objects are returned by reference', () => {
    const date = new Date(0);
    const map = new Map([['a', 1]]);
    const result = deepOmit({ date, map, a: 1 }, ['a']);
    expect(result.date).toBe(date);
    expect(result.map).toBe(map);
    expect(result).not.toHaveProperty('a');
  });

  test('returns a fresh copy when nothing matches', () => {
    const input = { a: { b: [1, { c: 2 }] } };
    const result = deepOmit(input, ['zzz']);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
    expect(result.a).not.toBe(input.a);
    expect(result.a.b).not.toBe(input.a.b);
  });

  test('does not mutate the input', () => {
    const input = { a: 1, b: { a: 2 }, list: [{ a: 3 }] };
    deepOmit(input, ['a']);
    expect(input).toEqual({ a: 1, b: { a: 2 }, list: [{ a: 3 }] });
  });
});
