import deepEqual from './solution.js';

describe('deepEqual', () => {
  test('example: nested structures', () => {
    expect(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] })).toBe(false);
  });

  test('example: array vs object', () => {
    expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
  });

  test('example: different key sets', () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false);
    expect(deepEqual({ a: undefined }, { b: undefined })).toBe(false);
  });

  test('primitives', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('a', 'b')).toBe(false);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual(1, '1')).toBe(false);
  });

  test('key order does not matter', () => {
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  test('primitives are compared with ===: NaN is unequal, 0 and -0 are equal', () => {
    expect(deepEqual(NaN, NaN)).toBe(false);
    expect(deepEqual({ a: NaN }, { a: NaN })).toBe(false);
    expect(deepEqual(0, -0)).toBe(true);
    expect(deepEqual([0], [-0])).toBe(true);
  });

  test('null and undefined are distinct from each other and from missing keys', () => {
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(undefined, null)).toBe(false);
    expect(deepEqual({ a: undefined }, { a: null })).toBe(false);
    expect(deepEqual({ a: undefined }, { a: undefined })).toBe(true);
    expect(deepEqual({ a: undefined }, {})).toBe(false);
  });

  test('different key counts are unequal in both directions', () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(deepEqual({ x: { a: 1 } }, { x: { a: 1, b: 1 } })).toBe(false);
  });

  test('arrays: length and order matter', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
    expect(deepEqual([1, 2], [2, 1])).toBe(false);
  });

  test('empty containers', () => {
    expect(deepEqual({}, {})).toBe(true);
    expect(deepEqual([], [])).toBe(true);
    expect(deepEqual({}, [])).toBe(false);
    expect(deepEqual([], {})).toBe(false);
    expect(deepEqual({ a: {} }, { a: [] })).toBe(false);
  });

  test('objects never equal primitives', () => {
    expect(deepEqual({}, null)).toBe(false);
    expect(deepEqual([], 0)).toBe(false);
    expect(deepEqual(['1'], '1')).toBe(false);
    expect(deepEqual({ a: '1' }, { a: 1 })).toBe(false);
  });

  test('deeply nested arrays of objects', () => {
    const make = (leaf) => ({ users: [{ id: 1, tags: ['a', { deep: [leaf] }] }], total: 1 });
    expect(deepEqual(make(1), make(1))).toBe(true);
    expect(deepEqual(make(1), make(2))).toBe(false);
  });

  test('the same reference is equal', () => {
    const obj = { a: [1] };
    expect(deepEqual(obj, obj)).toBe(true);
  });
});
