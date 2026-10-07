import get from './solution.js';

describe('get', () => {
  const obj = { a: [{ b: { c: 3 } }], n: null, zero: 0, f: false, empty: '' };

  test('example: string paths with brackets and dots', () => {
    expect(get(obj, 'a[0].b.c')).toBe(3);
    expect(get(obj, 'a.0.b.c')).toBe(3);
  });

  test('example: array paths, missing values and null', () => {
    expect(get(obj, ['a', 0, 'b', 'c'])).toBe(3);
    expect(get(obj, 'a[1].b', 'none')).toBe('none');
    expect(get(obj, 'n', 'none')).toBeNull();
  });

  test('returns undefined when missing and no default is given', () => {
    expect(get(obj, 'x.y')).toBeUndefined();
  });

  test('stops at null or undefined intermediates', () => {
    expect(get(obj, 'n.deep.path', 'd')).toBe('d');
    expect(get({ a: undefined }, 'a.b', 'd')).toBe('d');
  });

  test('falsy values other than undefined are returned', () => {
    expect(get(obj, 'zero', 'd')).toBe(0);
    expect(get(obj, 'f', 'd')).toBe(false);
    expect(get(obj, 'empty', 'd')).toBe('');
  });

  test('a value that exists but is undefined gives the default', () => {
    expect(get({ a: { b: undefined } }, 'a.b', 'd')).toBe('d');
  });

  test('an empty path returns the default', () => {
    expect(get(obj, [], 'd')).toBe('d');
    expect(get(obj, '', 'd')).toBe('d');
    expect(get(obj, [])).toBeUndefined();
  });

  test('array path keys are used as is, even with dots', () => {
    expect(get({ 'a.b': 1, a: { b: 2 } }, ['a.b'])).toBe(1);
    expect(get({ 'a.b': 1, a: { b: 2 } }, 'a.b')).toBe(2);
  });

  test('reads properties of primitives along the path', () => {
    expect(get({ s: 'hi' }, 's.length')).toBe(2);
    expect(get({ list: [1, 2, 3] }, 'list.length')).toBe(3);
  });

  test('null or undefined object returns the default', () => {
    expect(get(null, 'a', 'd')).toBe('d');
    expect(get(undefined, ['a'], 'd')).toBe('d');
  });

  test('returns nested references and does not mutate the input', () => {
    const input = { a: { b: [1] } };
    expect(get(input, 'a.b')).toBe(input.a.b);
    get(input, 'a.x.y', 1);
    expect(input).toEqual({ a: { b: [1] } });
  });
});
