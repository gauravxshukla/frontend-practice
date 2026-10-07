import memoize from './solution.js';

describe('memoize', () => {
  test('example: returns the cached result for the same argument', () => {
    const spy = jest.fn((n) => n * n);
    const square = memoize(spy);
    expect(square(4)).toBe(16);
    expect(square(4)).toBe(16);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(square(5)).toBe(25);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('example: a resolver builds the key from all arguments', () => {
    const spy = jest.fn((a, b) => a + b);
    const add = memoize(spy, (a, b) => `${a},${b}`);
    expect(add(1, 2)).toBe(3);
    expect(add(1, 3)).toBe(4);
    expect(add(1, 2)).toBe(3);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('the default key is only the first argument', () => {
    const spy = jest.fn((a, b) => a + b);
    const add = memoize(spy);
    expect(add(1, 2)).toBe(3);
    expect(add(1, 100)).toBe(3);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('exposes the cache as a Map', () => {
    const square = memoize((n) => n * n);
    square(3);
    expect(square.cache).toBeInstanceOf(Map);
    expect(square.cache.get(3)).toBe(9);
    expect(square.cache.size).toBe(1);
  });

  test('clearing the exposed cache forces a recompute', () => {
    const spy = jest.fn((n) => n + 1);
    const inc = memoize(spy);
    inc(1);
    inc.cache.clear();
    inc(1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('object keys are compared by reference', () => {
    const spy = jest.fn((obj) => obj.id);
    const getId = memoize(spy);
    const a = { id: 1 };
    const b = { id: 1 };
    getId(a);
    getId(a);
    expect(spy).toHaveBeenCalledTimes(1);
    getId(b);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('1 and "1" are different keys', () => {
    const spy = jest.fn((x) => typeof x);
    const kind = memoize(spy);
    expect(kind(1)).toBe('number');
    expect(kind('1')).toBe('string');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('caches undefined results', () => {
    const spy = jest.fn(() => undefined);
    const fn = memoize(spy);
    expect(fn('a')).toBeUndefined();
    expect(fn('a')).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('caches the call with no arguments under the undefined key', () => {
    const spy = jest.fn(() => 'value');
    const fn = memoize(spy);
    fn();
    fn();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('preserves this for fn and resolver', () => {
    const resolver = jest.fn(function (n) {
      return `${this.name}:${n}`;
    });
    const obj = {
      name: 'calc',
      factor: 3,
      times: memoize(function (n) {
        return n * this.factor;
      }, resolver),
    };
    expect(obj.times(2)).toBe(6);
    expect(obj.times.cache.get('calc:2')).toBe(6);
  });

  test('forwards all arguments to fn', () => {
    const spy = jest.fn(() => 'ok');
    const fn = memoize(spy);
    fn('a', 'b', 'c');
    expect(spy).toHaveBeenCalledWith('a', 'b', 'c');
  });

  test('does not cache when fn throws', () => {
    let fail = true;
    const spy = jest.fn(() => {
      if (fail) throw new Error('boom');
      return 'ok';
    });
    const fn = memoize(spy);
    expect(() => fn(1)).toThrow('boom');
    fail = false;
    expect(fn(1)).toBe('ok');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('separate memoized functions have separate caches', () => {
    const spy = jest.fn((n) => n * 2);
    const a = memoize(spy);
    const b = memoize(spy);
    a(1);
    b(1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(a.cache).not.toBe(b.cache);
  });
});
