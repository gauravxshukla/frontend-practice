import once from './solution.js';

describe('once', () => {
  test('example: calls func only the first time', () => {
    const spy = jest.fn(() => 42);
    const init = once(spy);
    expect(init()).toBe(42);
    expect(init()).toBe(42);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('example: later calls return the first result, ignoring new arguments', () => {
    const add = once((a, b) => a + b);
    expect(add(1, 2)).toBe(3);
    expect(add(10, 20)).toBe(3);
  });

  test('forwards the arguments of the first call', () => {
    const spy = jest.fn();
    const wrapped = once(spy);
    wrapped('a', 1, { x: true });
    wrapped('b');
    expect(spy).toHaveBeenCalledWith('a', 1, { x: true });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('preserves this', () => {
    const counter = {
      count: 5,
      bump: once(function () {
        return ++this.count;
      }),
    };
    expect(counter.bump()).toBe(6);
    expect(counter.bump()).toBe(6);
    expect(counter.count).toBe(6);
  });

  test('a falsy or undefined result still counts as called', () => {
    for (const value of [undefined, 0, '', null, false]) {
      const spy = jest.fn(() => value);
      const wrapped = once(spy);
      expect(wrapped()).toBe(value);
      expect(wrapped()).toBe(value);
      expect(spy).toHaveBeenCalledTimes(1);
    }
  });

  test('rethrows the first error and never calls func again', () => {
    const spy = jest.fn(() => {
      throw new Error('boom');
    });
    const wrapped = once(spy);
    expect(() => wrapped()).toThrow('boom');
    expect(wrapped()).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('a re-entrant call does not run func twice', () => {
    let wrapped;
    const spy = jest.fn(() => {
      wrapped();
      return 'done';
    });
    wrapped = once(spy);
    expect(wrapped()).toBe('done');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('separate wrappers are independent', () => {
    const spy = jest.fn((x) => x * 2);
    const a = once(spy);
    const b = once(spy);
    expect(a(1)).toBe(2);
    expect(b(5)).toBe(10);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
