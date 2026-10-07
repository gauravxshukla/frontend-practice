import pick from './solution.js';

describe('pick', () => {
  const user = { id: 1, name: 'Ada', meta: { role: 'admin', tags: ['x'] } };

  test('example: keeps only the listed keys and ignores missing ones', () => {
    expect(pick(user, ['id', 'name'])).toEqual({ id: 1, name: 'Ada' });
    expect(pick(user, ['id', 'missing'])).toEqual({ id: 1 });
  });

  test('example: dotted paths pick nested values', () => {
    expect(pick(user, ['meta.role'])).toEqual({ meta: { role: 'admin' } });
    expect(pick(user, ['id', 'meta.role', 'meta.nope'])).toEqual({ id: 1, meta: { role: 'admin' } });
  });

  test('paths with a shared prefix are merged', () => {
    const obj = { a: { b: 1, c: 2, d: 3 } };
    expect(pick(obj, ['a.b', 'a.c'])).toEqual({ a: { b: 1, c: 2 } });
  });

  test('deep paths through several levels', () => {
    const obj = { a: { b: { c: { d: 4, e: 5 } } } };
    expect(pick(obj, ['a.b.c.d'])).toEqual({ a: { b: { c: { d: 4 } } } });
  });

  test('a missing intermediate skips the path entirely', () => {
    expect(pick({ a: null, b: 1 }, ['a.x', 'c.d', 'b'])).toEqual({ b: 1 });
    expect(pick({ a: null }, ['a.x'])).not.toHaveProperty('a');
  });

  test('keeps keys whose value is undefined', () => {
    const result = pick({ a: undefined, b: 1 }, ['a']);
    expect(Object.keys(result)).toEqual(['a']);
  });

  test('ignores inherited properties', () => {
    const obj = Object.create({ inherited: 1 });
    obj.own = 2;
    expect(pick(obj, ['own', 'inherited', 'toString'])).toEqual({ own: 2 });
  });

  test('copies values by reference without cloning', () => {
    const result = pick(user, ['meta']);
    expect(result.meta).toBe(user.meta);
  });

  test('null or undefined object and empty keys', () => {
    expect(pick(null, ['a'])).toEqual({});
    expect(pick(undefined, ['a'])).toEqual({});
    expect(pick(user, [])).toEqual({});
  });

  test('does not mutate the input', () => {
    const obj = { a: { b: 1, c: 2 }, d: 3 };
    const result = pick(obj, ['a.b', 'd']);
    result.a.extra = true;
    expect(obj).toEqual({ a: { b: 1, c: 2 }, d: 3 });
    expect(result.a).not.toBe(obj.a);
  });

  test('picking a key and then a path inside it does not write into the source', () => {
    const obj = { a: { b: 1, c: 2 } };
    const result = pick(obj, ['a', 'a.b']);
    expect(result).toEqual({ a: { b: 1, c: 2 } });
    result.a.extra = true;
    expect(obj).toEqual({ a: { b: 1, c: 2 } });
  });
});
