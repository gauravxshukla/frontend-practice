import deepClone from './solution.js';

describe('deepClone', () => {
  test('example: mutating the copy leaves the original alone', () => {
    const obj = { user: { roles: ['admin'] } };
    const copy = deepClone(obj);
    copy.user.roles.push('editor');
    expect(obj.user.roles).toEqual(['admin']);
  });

  test('example: copies nested objects and arrays', () => {
    const obj = { user: { roles: ['admin'], meta: null }, list: [{ id: 1 }] };
    const copy = deepClone(obj);
    expect(copy).toEqual(obj);
    expect(copy).not.toBe(obj);
    expect(copy.user).not.toBe(obj.user);
    expect(copy.user.roles).not.toBe(obj.user.roles);
    expect(copy.list[0]).not.toBe(obj.list[0]);
  });

  test('primitives and null', () => {
    expect(deepClone(1)).toBe(1);
    expect(deepClone('a')).toBe('a');
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  test('more primitives are returned as is', () => {
    expect(deepClone(true)).toBe(true);
    expect(deepClone(0)).toBe(0);
    expect(deepClone('')).toBe('');
  });

  test('nested arrays are copied at every level', () => {
    const arr = [[1, [2, [3]]], [4]];
    const copy = deepClone(arr);
    expect(copy).toEqual(arr);
    expect(copy[0]).not.toBe(arr[0]);
    expect(copy[0][1]).not.toBe(arr[0][1]);
    expect(copy[0][1][1]).not.toBe(arr[0][1][1]);
    expect(copy[1]).not.toBe(arr[1]);
  });

  test('empty objects and arrays become new instances', () => {
    const obj = {};
    const arr = [];
    expect(deepClone(obj)).toEqual({});
    expect(deepClone(obj)).not.toBe(obj);
    expect(deepClone(arr)).toEqual([]);
    expect(deepClone(arr)).not.toBe(arr);
  });

  test('arrays stay arrays and objects stay objects', () => {
    expect(Array.isArray(deepClone([{ a: [] }]))).toBe(true);
    expect(Array.isArray(deepClone([{ a: [] }])[0].a)).toBe(true);
    expect(Array.isArray(deepClone({ 0: 'a', length: 1 }))).toBe(false);
    expect(deepClone({ 0: 'a', length: 1 })).toEqual({ 0: 'a', length: 1 });
  });

  test('keys with undefined or null values are kept, in order', () => {
    const copy = deepClone({ b: undefined, a: null, c: 0 });
    expect(Object.keys(copy)).toEqual(['b', 'a', 'c']);
    expect(copy.b).toBeUndefined();
    expect(copy.a).toBeNull();
  });

  test('mutating the original leaves the copy alone', () => {
    const obj = { a: { b: [1, { c: 2 }] } };
    const copy = deepClone(obj);
    obj.a.b[1].c = 99;
    obj.a.b.push(3);
    obj.a.x = 1;
    expect(copy).toEqual({ a: { b: [1, { c: 2 }] } });
  });

  test('an object referenced twice is never shared with the original', () => {
    const shared = { n: 1 };
    const obj = { x: shared, y: [shared] };
    const copy = deepClone(obj);
    expect(copy.x).not.toBe(shared);
    expect(copy.y[0]).not.toBe(shared);
    expect(copy.x).toEqual({ n: 1 });
    expect(copy.y[0]).toEqual({ n: 1 });
  });

  test('does not mutate the input', () => {
    const obj = { a: [1, { b: 2 }] };
    deepClone(obj);
    expect(obj).toEqual({ a: [1, { b: 2 }] });
  });
});
