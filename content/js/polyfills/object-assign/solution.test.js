import objectAssign from './solution.js';

describe('objectAssign', () => {
  test('example: copies properties and later sources win', () => {
    const target = { a: 1 };
    expect(objectAssign(target, { b: 2 }, { a: 3, c: 4 })).toEqual({ a: 3, b: 2, c: 4 });
  });

  test('example: returns and mutates the target itself', () => {
    const target = { a: 1 };
    const result = objectAssign(target, { b: 2 });
    expect(result).toBe(target);
    expect(target).toEqual({ a: 1, b: 2 });
  });

  test('copies symbol keys', () => {
    const sym = Symbol('id');
    const result = objectAssign({}, { [sym]: 42, x: 1 });
    expect(result[sym]).toBe(42);
    expect(result.x).toBe(1);
  });

  test('skips null and undefined sources', () => {
    expect(objectAssign({ a: 1 }, null, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  test('throws a TypeError for a null or undefined target', () => {
    expect(() => objectAssign(null, { a: 1 })).toThrow(TypeError);
    expect(() => objectAssign(undefined)).toThrow(TypeError);
  });

  test('invokes source getters and copies the value', () => {
    const getter = jest.fn(() => 'computed');
    const source = {};
    Object.defineProperty(source, 'value', { get: getter, enumerable: true });
    const result = objectAssign({}, source);
    expect(getter).toHaveBeenCalledTimes(1);
    const desc = Object.getOwnPropertyDescriptor(result, 'value');
    expect(desc.value).toBe('computed');
    expect(desc.get).toBeUndefined();
  });

  test('ignores inherited and non-enumerable properties', () => {
    const proto = { inherited: true };
    const source = Object.create(proto);
    source.own = 1;
    Object.defineProperty(source, 'hidden', { value: 2, enumerable: false });
    Object.defineProperty(source, Symbol('hiddenSym'), { value: 3, enumerable: false });
    const result = objectAssign({}, source);
    expect(Reflect.ownKeys(result)).toEqual(['own']);
  });

  test('runs setters on the target', () => {
    const seen = [];
    const target = {
      set name(v) {
        seen.push(v);
      },
    };
    objectAssign(target, { name: 'a' }, { name: 'b' });
    expect(seen).toEqual(['a', 'b']);
  });

  test('is shallow', () => {
    const nested = { deep: 1 };
    const result = objectAssign({}, { nested });
    expect(result.nested).toBe(nested);
  });

  test('string sources contribute index keys; other primitives add nothing', () => {
    expect(objectAssign({}, 'hi', 10, true)).toEqual({ 0: 'h', 1: 'i' });
  });

  test('works with arrays as target and source', () => {
    expect(objectAssign([1, 2, 3], [9, 8])).toEqual([9, 8, 3]);
  });
});
