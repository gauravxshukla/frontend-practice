import myEvery from './solution.js';

beforeAll(() => {
  Array.prototype.myEvery = myEvery;
});
afterAll(() => {
  delete Array.prototype.myEvery;
});

const isEven = (n) => n % 2 === 0;

describe('Array.prototype.myEvery', () => {
  test('example: true when every element matches', () => {
    expect([2, 4, 6].myEvery(isEven)).toBe(true);
  });

  test('example: false when one element fails', () => {
    expect([2, 3, 4].myEvery(isEven)).toBe(false);
  });

  test('short-circuits after the first falsy result', () => {
    const spy = jest.fn(isEven);
    [2, 4, 5, 6, 7].myEvery(spy);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenLastCalledWith(5, 2, [2, 4, 5, 6, 7]);
  });

  test('an empty array returns true without calling back', () => {
    const spy = jest.fn(() => false);
    expect([].myEvery(spy)).toBe(true);
    expect(spy).not.toHaveBeenCalled();
  });

  test('skips holes', () => {
    const spy = jest.fn((v) => v !== undefined);
    // eslint-disable-next-line no-sparse-arrays
    expect([1, , 3].myEvery(spy)).toBe(true);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(new Array(3).myEvery(() => false)).toBe(true);
  });

  test('uses thisArg', () => {
    const ctx = { max: 10 };
    expect(
      [1, 5, 9].myEvery(function (n) {
        return n < this.max;
      }, ctx),
    ).toBe(true);
  });

  test('returns a real boolean for truthy and falsy callback results', () => {
    expect([1, 2].myEvery(() => 'yes')).toBe(true);
    expect([1, 2].myEvery(() => 0)).toBe(false);
  });

  test('passes value, index and array', () => {
    const arr = ['x'];
    const spy = jest.fn(() => true);
    arr.myEvery(spy);
    expect(spy).toHaveBeenCalledWith('x', 0, arr);
  });

  test('throws a TypeError when callbackFn is not a function', () => {
    expect(() => [1].myEvery()).toThrow(TypeError);
  });
});
