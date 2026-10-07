import isEmpty from './solution.js';

describe('isEmpty', () => {
  test('example: null, empty strings, arrays and objects are empty', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
  });

  test('example: non-empty collections and the key-exists rule', () => {
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: undefined })).toBe(false);
    expect(isEmpty(new Map([['k', 1]]))).toBe(false);
  });

  test('undefined is empty', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  test('strings check their length', () => {
    expect(isEmpty('a')).toBe(false);
    expect(isEmpty(' ')).toBe(false);
  });

  test('numbers, booleans, bigints and symbols are always empty', () => {
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(42)).toBe(true);
    expect(isEmpty(NaN)).toBe(true);
    expect(isEmpty(true)).toBe(true);
    expect(isEmpty(false)).toBe(true);
    expect(isEmpty(1n)).toBe(true);
    expect(isEmpty(Symbol('s'))).toBe(true);
  });

  test('Map and Set check size', () => {
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new Set([0]))).toBe(false);
  });

  test('array-likes check length', () => {
    expect(isEmpty({ length: 0 })).toBe(true);
    expect(isEmpty({ 0: 'a', length: 1 })).toBe(false);
    expect(isEmpty(new Uint8Array(0))).toBe(true);
    expect(isEmpty(new Uint8Array(2))).toBe(false);
    (function () {
      expect(isEmpty(arguments)).toBe(true);
    })();
    (function () {
      expect(isEmpty(arguments)).toBe(false);
    })(1);
  });

  test('sparse arrays are not empty', () => {
    expect(isEmpty(new Array(3))).toBe(false);
  });

  test('only own enumerable string keys count', () => {
    expect(isEmpty(Object.create({ inherited: 1 }))).toBe(true);
    expect(isEmpty(Object.create(null))).toBe(true);
    const hidden = {};
    Object.defineProperty(hidden, 'x', { value: 1, enumerable: false });
    expect(isEmpty(hidden)).toBe(true);
    expect(isEmpty({ [Symbol('s')]: 1 })).toBe(true);
  });

  test('class instances check own keys', () => {
    class Empty {}
    class Full {
      constructor() {
        this.a = 1;
      }
    }
    expect(isEmpty(new Empty())).toBe(true);
    expect(isEmpty(new Full())).toBe(false);
  });

  test('does not mutate the input', () => {
    const obj = { a: 1 };
    isEmpty(obj);
    expect(obj).toEqual({ a: 1 });
  });
});
