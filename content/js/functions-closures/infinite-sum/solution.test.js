import sum from './solution.js';

describe('sum', () => {
  test('example: chains single arguments', () => {
    expect(sum(1)(2)(3)()).toBe(6);
  });

  test('example: a call can pass several numbers', () => {
    expect(sum(1, 2)(3)()).toBe(6);
    expect(sum(5)()).toBe(5);
  });

  test('sum() alone returns 0', () => {
    expect(sum()).toBe(0);
  });

  test('intermediate functions can be reused independently', () => {
    const s = sum(1);
    expect(s(2)()).toBe(3);
    expect(s(3)()).toBe(4);
    expect(s()).toBe(1);
  });

  test('reusing a deeper intermediate', () => {
    const s = sum(1)(2);
    const a = s(10);
    const b = s(20);
    expect(a()).toBe(13);
    expect(b()).toBe(23);
    expect(a()).toBe(13);
  });

  test('handles zeros without ending the chain', () => {
    expect(sum(0)(0)(5)()).toBe(5);
    expect(sum(0)()).toBe(0);
  });

  test('handles negatives and decimals', () => {
    expect(sum(-1)(4)(-3)()).toBe(0);
    expect(sum(0.5)(0.25)()).toBeCloseTo(0.75);
  });

  test('handles long chains', () => {
    let fn = sum(1);
    for (let i = 0; i < 99; i++) fn = fn(1);
    expect(fn()).toBe(100);
  });

  test('intermediate results are functions until terminated', () => {
    expect(sum(1)).toBeTypeOf('function');
    expect(sum(1)(2)).toBeTypeOf('function');
  });
});
