import limit from './solution.js';

describe('limit', () => {
  test('calls func at most n times and then returns the last result', () => {
    let i = 0;
    const inc = limit(() => ++i, 2);
    expect(inc()).toBe(1);
    expect(inc()).toBe(2);
    expect(inc()).toBe(2);
    expect(i).toBe(2);
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
});
