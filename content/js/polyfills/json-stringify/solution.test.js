import jsonStringify from './solution.js';

// Every expectation is checked against the native implementation.
const same = (value) => expect(jsonStringify(value)).toBe(JSON.stringify(value));

describe('jsonStringify', () => {
  test('example: nested objects and arrays', () => {
    const value = { a: [1, 'x', null], b: true };
    expect(jsonStringify(value)).toBe('{"a":[1,"x",null],"b":true}');
    same(value);
  });

  test('example: escapes quotes and newlines', () => {
    expect(jsonStringify('he said "hi"\n')).toBe('"he said \\"hi\\"\\n"');
    same('he said "hi"\n');
  });

  test('example: drops undefined properties and turns NaN into null', () => {
    expect(jsonStringify({ skip: undefined, n: NaN })).toBe('{"n":null}');
    same({ skip: undefined, n: NaN });
  });

  test('example: top-level undefined returns undefined', () => {
    expect(jsonStringify(undefined)).toBeUndefined();
  });

  test.each([[null], [true], [false], [0], [-0], [42], [-3.5], [1e21], [1e-7], [''], ['plain']])(
    'primitive %s',
    (value) => {
      same(value);
    },
  );

  test('NaN, Infinity and -Infinity become null', () => {
    same(NaN);
    same(Infinity);
    same([NaN, -Infinity, 1]);
    expect(jsonStringify(Infinity)).toBe('null');
  });

  test('escapes backslashes, short escapes and control characters', () => {
    same('back\\slash');
    same('\b\f\n\r\t');
    same('\u0000\u0001\u001f');
    same('\u007f é 😀  ');
    expect(jsonStringify('\u0001')).toBe('"\\u0001"');
    expect(jsonStringify('\u001f')).toBe('"\\u001f"');
  });

  test('escapes object keys too', () => {
    same({ 'a"b': 1, 'new\nline': 2 });
  });

  test('omits undefined, functions and symbols in objects', () => {
    const value = { a: undefined, b: () => 1, c: Symbol('s'), d: 1 };
    expect(jsonStringify(value)).toBe('{"d":1}');
    same(value);
  });

  test('turns undefined, functions, symbols and holes in arrays into null', () => {
    // eslint-disable-next-line no-sparse-arrays
    const value = [undefined, () => 1, Symbol('s'), , 5];
    expect(jsonStringify(value)).toBe('[null,null,null,null,5]');
    same(value);
  });

  test('top-level functions and symbols return undefined', () => {
    expect(jsonStringify(() => {})).toBeUndefined();
    expect(jsonStringify(Symbol('x'))).toBeUndefined();
  });

  test('empty containers', () => {
    same({});
    same([]);
    same({ a: {}, b: [] });
    same([[], [{}]]);
  });

  test('deeply nested structures', () => {
    same({ a: { b: { c: [1, { d: [2, [3, { e: 'f' }]] }] } } });
  });

  test('ignores symbol keys, non-enumerable and inherited properties', () => {
    const value = Object.create({ inherited: 1 });
    value.own = 2;
    value[Symbol('k')] = 3;
    Object.defineProperty(value, 'hidden', { value: 4, enumerable: false });
    expect(jsonStringify(value)).toBe('{"own":2}');
    same(value);
  });

  test('keeps normal key order (integer keys first)', () => {
    same({ b: 1, 2: 'two', a: 2, 1: 'one' });
  });

  test('serialises Dates via toJSON', () => {
    const value = { when: new Date(Date.UTC(2024, 0, 2, 3, 4, 5)) };
    expect(jsonStringify(value)).toBe('{"when":"2024-01-02T03:04:05.000Z"}');
    same(value);
    same(new Date(NaN));
  });

  test('calls toJSON with the property key', () => {
    const toJSON = jest.fn((key) => `key:${key}`);
    const item = { toJSON };
    const value = { a: item, list: [item] };
    same(value);
    toJSON.mockClear();
    jsonStringify(value);
    expect(toJSON.mock.calls.map((c) => c[0])).toEqual(['a', '0']);
    expect(jsonStringify(item)).toBe('"key:"');
  });

  test('toJSON may return any value, including undefined', () => {
    same({ a: { toJSON: () => ({ nested: [1] }) }, b: { toJSON: () => undefined }, c: 1 });
    same([{ toJSON: () => undefined }]);
  });

  test('unwraps boxed primitives', () => {
    same([new Number(3), new String('s'), new Boolean(false)]);
  });

  test('throws a TypeError for BigInt values', () => {
    expect(() => jsonStringify(10n)).toThrow(TypeError);
    expect(() => jsonStringify({ a: [1n] })).toThrow(TypeError);
  });

  test('throws a TypeError for circular references', () => {
    const obj = { name: 'loop' };
    obj.self = obj;
    expect(() => jsonStringify(obj)).toThrow(TypeError);
    const arr = [1];
    arr.push({ back: arr });
    expect(() => jsonStringify(arr)).toThrow(TypeError);
  });

  test('allows the same object in non-circular positions', () => {
    const shared = { x: 1 };
    const value = { a: shared, b: shared, c: [shared, shared] };
    same(value);
  });

  test('Map and Set serialise as empty objects', () => {
    same({ m: new Map([[1, 2]]), s: new Set([1]) });
  });
});
