import set from './solution.js';

describe('set', () => {
  test('example: creates nested objects and keeps existing keys', () => {
    const obj = { a: { keep: true } };
    set(obj, 'a.b.c', 1);
    expect(obj).toEqual({ a: { keep: true, b: { c: 1 } } });
  });

  test('example: creates arrays for integer index keys', () => {
    const obj = {};
    set(obj, 'list[0].id', 7);
    expect(Array.isArray(obj.list)).toBe(true);
    expect(obj.list).toEqual([{ id: 7 }]);
  });

  test('mutates and returns the same object', () => {
    const obj = {};
    expect(set(obj, 'a', 1)).toBe(obj);
    expect(obj.a).toBe(1);
  });

  test('array paths, including numeric keys', () => {
    const obj = {};
    set(obj, ['x', 0, 'y'], 'v');
    expect(Array.isArray(obj.x)).toBe(true);
    expect(obj.x[0]).toEqual({ y: 'v' });
  });

  test('a string index creates an array with that length', () => {
    const obj = {};
    set(obj, ['x', '2'], 'v');
    expect(Array.isArray(obj.x)).toBe(true);
    expect(obj.x).toHaveLength(3);
    expect(obj.x[2]).toBe('v');
  });

  test('dot-separated numeric keys also create arrays', () => {
    const obj = {};
    set(obj, 'a.0.b', 1);
    expect(Array.isArray(obj.a)).toBe(true);
    expect(obj.a[0]).toEqual({ b: 1 });
  });

  test('non-index keys create objects', () => {
    const obj = {};
    set(obj, 'a.-1.b', 1);
    set(obj, 'c.1x', 2);
    expect(Array.isArray(obj.a)).toBe(false);
    expect(obj.a).toEqual({ '-1': { b: 1 } });
    expect(obj.c).toEqual({ '1x': 2 });
  });

  test('overwrites primitives and null along the way', () => {
    const obj = { a: 5, n: null, s: 'str' };
    set(obj, 'a.b', 1);
    set(obj, 'n[0]', 'x');
    set(obj, 's.t', true);
    expect(obj).toEqual({ a: { b: 1 }, n: ['x'], s: { t: true } });
  });

  test('reuses existing arrays and overwrites the leaf', () => {
    const list = [{ id: 1 }, { id: 2 }];
    const obj = { list };
    set(obj, 'list[1].id', 20);
    expect(obj.list).toBe(list);
    expect(list).toEqual([{ id: 1 }, { id: 20 }]);
  });

  test('can set undefined and falsy values', () => {
    const obj = { a: { b: 1 } };
    set(obj, 'a.b', undefined);
    set(obj, 'a.c', 0);
    expect('b' in obj.a).toBe(true);
    expect(obj.a.b).toBeUndefined();
    expect(obj.a.c).toBe(0);
  });

  test('an empty path changes nothing', () => {
    const obj = { a: 1 };
    expect(set(obj, [], 2)).toBe(obj);
    expect(set(obj, '', 2)).toBe(obj);
    expect(obj).toEqual({ a: 1 });
  });
});
