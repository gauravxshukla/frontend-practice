import curry from './solution.js';

const add3 = (a, b, c) => a + b + c;

describe('curry', () => {
  test('one argument at a time', () => {
    expect(curry(add3)(1)(2)(3)).toBe(6);
  });

  test('mixed groupings', () => {
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
});
