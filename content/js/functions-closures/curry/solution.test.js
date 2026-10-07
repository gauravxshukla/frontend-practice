import curry from './solution.js';

const add3 = (a, b, c) => a + b + c;

describe('curry', () => {
  test('example: one argument at a time', () => {
    expect(curry(add3)(1)(2)(3)).toBe(6);
  });

  test('example: mixed groupings', () => {
    const c = curry(add3);
    expect(c(1, 2)(3)).toBe(6);
    expect(c(1)(2, 3)).toBe(6);
    expect(c(1, 2, 3)).toBe(6);
  });

  test('zero-arity function is called immediately', () => {
    expect(curry(() => 42)()).toBe(42);
  });

  test('partial applications are independent', () => {
    const p = curry(add3)(1);
    expect(p(2)(3)).toBe(6);
    expect(p(10)(20)).toBe(31);
  });

  test('forwards this', () => {
    function mul(a, b) { return this.k * a * b; }
    const obj = { k: 2, mul: curry(mul) };
    expect(obj.mul(3, 4)).toBe(24);
  });

  test('does not call func until enough arguments are collected', () => {
    let calls = 0;
    const c = curry((a, b, c2) => {
      calls++;
      return [a, b, c2];
    });
    const step1 = c(1);
    const step2 = step1(2);
    expect(typeof step1).toBe('function');
    expect(typeof step2).toBe('function');
    expect(calls).toBe(0);
    expect(step2(3)).toEqual([1, 2, 3]);
    expect(calls).toBe(1);
  });

  test('extra arguments are passed through to func', () => {
    const c = curry(function (a, b) {
      return Array.from(arguments);
    });
    expect(c(1, 2, 3)).toEqual([1, 2, 3]);
    expect(c(1)(2, 3, 4)).toEqual([1, 2, 3, 4]);
  });

  test('an empty call does not count toward the arity', () => {
    const c = curry(add3);
    expect(typeof c()).toBe('function');
    expect(c()(1)()(2, 3)).toBe(6);
  });

  test('the curried function can be reused', () => {
    const c = curry(add3);
    expect(c(1)(2)(3)).toBe(6);
    expect(c(4)(5)(6)).toBe(15);
    expect(c(7, 8)(9)).toBe(24);
  });

  test('uses func.length, which ignores default parameters', () => {
    const withDefault = curry((a, b = 10) => a + b);
    expect(withDefault(1)).toBe(11);
  });

  test('forwards this through partial applications', () => {
    function sum(a, b, c) { return this.base + a + b + c; }
    const obj = { base: 100, sum: curry(sum) };
    const partial = obj.sum(1);
    const holder = { base: 1000, partial };
    expect(holder.partial(2, 3)).toBe(1006);
  });

  test('returns whatever func returns, including falsy values', () => {
    expect(curry((a, b) => a && b)(0)(1)).toBe(0);
    expect(curry((a) => undefined)(1)).toBeUndefined();
  });
});
