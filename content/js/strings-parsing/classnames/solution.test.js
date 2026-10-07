import classNames from './solution.js';

describe('classNames', () => {
  test('example: joins strings and truthy object keys', () => {
    expect(classNames('foo', 'bar')).toBe('foo bar');
    expect(classNames('foo', { bar: true, baz: false })).toBe('foo bar');
  });

  test('example: flattens nested arrays and skips falsy values', () => {
    expect(classNames({ 'foo-bar': true }, null, ['qux', ['quux', { corge: 1 }]])).toBe(
      'foo-bar qux quux corge',
    );
    expect(classNames('a', 0, undefined, 1, false, 'b')).toBe('a 1 b');
  });

  test('no arguments returns an empty string', () => {
    expect(classNames()).toBe('');
    expect(classNames(null, undefined, false, '', 0, NaN)).toBe('');
  });

  test('includes numbers', () => {
    expect(classNames(1, 2.5, -3)).toBe('1 2.5 -3');
  });

  test('object values use truthiness', () => {
    expect(
      classNames({ a: 1, b: 0, c: 'yes', d: '', e: null, f: undefined, g: [], h: {} }),
    ).toBe('a c g h');
  });

  test('handles deeply nested arrays and objects', () => {
    expect(classNames(['a', ['b', ['c', ['d', [{ e: true, f: false }, ['g']]]]]])).toBe(
      'a b c d e g',
    );
    expect(classNames([[[]]], [null, [undefined, [false]]])).toBe('');
  });

  test('ignores booleans and functions', () => {
    expect(classNames(true, 'a', () => 'b', function c() {}, false)).toBe('a');
  });

  test('ignores non-plain objects', () => {
    class Thing {
      constructor() {
        this.foo = true;
      }
    }
    expect(classNames(new Date(0), new Map([['x', true]]), new Thing(), 'ok')).toBe('ok');
  });

  test('accepts objects without a prototype', () => {
    const flags = Object.create(null);
    flags.active = true;
    flags.hidden = false;
    expect(classNames(flags)).toBe('active');
  });

  test('keeps argument order and duplicates', () => {
    expect(classNames('b', { a: true }, ['b'], 'a')).toBe('b a b a');
  });

  test('does not mutate its inputs', () => {
    const list = ['a', ['b']];
    const flags = { c: true };
    classNames(list, flags);
    expect(list).toEqual(['a', ['b']]);
    expect(flags).toEqual({ c: true });
  });
});
