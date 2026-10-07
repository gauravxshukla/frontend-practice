import limit from './solution.js';

describe('limit', () => {
  test('example: calls func at most n times and then returns the last result', () => {
    let i = 0;
    const inc = limit(() => ++i, 2);
    expect(inc()).toBe(1);
    expect(inc()).toBe(2);
    expect(inc()).toBe(2);
    expect(i).toBe(2);
  });

  test('example: func is not called again after the limit', () => {
    const spy = jest.fn(() => 'value');
    const limited = limit(spy, 2);
    limited();
    limited();
    limited();
    limited();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('n = 0 never calls func', () => {
    let calls = 0;
    const fn = limit(() => ++calls, 0);
    expect(fn()).toBe(undefined);
    expect(calls).toBe(0);
  });

  test('forwards arguments and this', () => {
    const obj = {
      base: 10,
      add: limit(function (x, y) { return this.base + x + y; }, 1),
    };
    expect(obj.add(1, 2)).toBe(13);
    expect(obj.add(100, 100)).toBe(13);
  });

  test('returns the result of the last invocation, not the first', () => {
    const double = limit((x) => x * 2, 2);
    expect(double(1)).toBe(2);
    expect(double(5)).toBe(10);
    expect(double(100)).toBe(10);
  });

  test('forwards each call\'s own arguments while calls remain', () => {
    const spy = jest.fn();
    const limited = limit(spy, 3);
    limited('a', 1);
    limited('b', 2);
    limited('c', 3);
    limited('d', 4);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, 'a', 1);
    expect(spy).toHaveBeenNthCalledWith(3, 'c', 3);
  });

  test('an undefined result still counts as an invocation', () => {
    const spy = jest.fn(() => undefined);
    const limited = limit(spy, 1);
    expect(limited()).toBeUndefined();
    expect(limited()).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('a throwing call still counts toward n', () => {
    const spy = jest
      .fn()
      .mockReturnValueOnce('ok')
      .mockImplementationOnce(() => {
        throw new Error('boom');
      });
    const limited = limit(spy, 2);
    expect(limited()).toBe('ok');
    expect(() => limited()).toThrow('boom');
    expect(limited()).toBe('ok');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('wrappers around the same func have independent counters', () => {
    const spy = jest.fn((x) => x);
    const a = limit(spy, 1);
    const b = limit(spy, 1);
    expect(a('a')).toBe('a');
    expect(b('b')).toBe('b');
    expect(a('again')).toBe('a');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('n = 1 behaves like once', () => {
    const spy = jest.fn(() => ({ created: true }));
    const init = limit(spy, 1);
    const first = init();
    expect(init()).toBe(first);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
