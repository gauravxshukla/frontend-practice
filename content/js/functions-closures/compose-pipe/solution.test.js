import pipe from './solution.js';

describe('pipe', () => {
  test('example: runs functions left to right', () => {
    const add = (a, b) => a + b;
    const double = (x) => x * 2;
    const toLabel = (x) => `Total: ${x}`;
    expect(pipe(add, double, toLabel)(2, 3)).toBe('Total: 10');
  });

  test('example: no functions returns the first argument', () => {
    expect(pipe()(42)).toBe(42);
  });

  test('order matters', () => {
    const inc = (x) => x + 1;
    const double = (x) => x * 2;
    expect(pipe(inc, double)(3)).toBe(8);
    expect(pipe(double, inc)(3)).toBe(7);
  });

  test('a single function is just called', () => {
    const spy = jest.fn((a, b) => a * b);
    expect(pipe(spy)(4, 5)).toBe(20);
    expect(spy).toHaveBeenCalledWith(4, 5);
  });

  test('later functions receive only the previous result', () => {
    const second = jest.fn((x) => x);
    pipe((a, b) => a + b, second)(1, 2);
    expect(second).toHaveBeenCalledTimes(1);
    expect(second.mock.calls[0]).toEqual([3]);
  });

  test('preserves this for the first function', () => {
    const obj = {
      base: 10,
      run: pipe(function (x) {
        return this.base + x;
      }, (x) => x * 2),
    };
    expect(obj.run(5)).toBe(30);
  });

  test('does nothing until called, and reruns the chain each call', () => {
    const spy = jest.fn((x) => x + 1);
    const run = pipe(spy, spy);
    expect(spy).not.toHaveBeenCalled();
    expect(run(0)).toBe(2);
    expect(run(10)).toBe(12);
    expect(spy).toHaveBeenCalledTimes(4);
  });

  test('passes falsy intermediate results through', () => {
    const run = pipe(() => 0, (x) => x === 0, (x) => (x ? null : 'wrong'));
    expect(run()).toBeNull();
  });
});
