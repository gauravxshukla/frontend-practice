import mySome from './solution.js';

beforeAll(() => {
  Array.prototype.mySome = mySome;
});
afterAll(() => {
  delete Array.prototype.mySome;
});

const isEven = (n) => n % 2 === 0;

describe('Array.prototype.mySome', () => {
  test('example: true when an element matches', () => {
    expect([1, 3, 4, 5].mySome(isEven)).toBe(true);
  });

  test('example: false when nothing matches', () => {
    expect([1, 3, 5].mySome(isEven)).toBe(false);
  });

  test('short-circuits after the first truthy result', () => {
    const spy = jest.fn(isEven);
    [1, 3, 4, 5, 6].mySome(spy);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenLastCalledWith(4, 2, [1, 3, 4, 5, 6]);
  });

  test('an empty array returns false without calling back', () => {
    const spy = jest.fn(() => true);
    expect([].mySome(spy)).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  test('skips holes', () => {
    const spy = jest.fn((v) => v === undefined);
    // eslint-disable-next-line no-sparse-arrays
    expect([1, , 3].mySome(spy)).toBe(false);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('uses thisArg', () => {
    const ctx = { target: 3 };
    expect(
      [1, 2, 3].mySome(function (n) {
        return n === this.target;
      }, ctx),
    ).toBe(true);
  });

  test('returns a real boolean for truthy callback results', () => {
    expect([0, 1].mySome((n) => (n ? 'yes' : ''))).toBe(true);
    expect([0].mySome(() => 0)).toBe(false);
  });

  test('does not visit elements appended during iteration', () => {
    const arr = [1, 3];
    const spy = jest.fn((v, i, a) => {
      a.push(2);
      return false;
    });
    expect(arr.mySome(spy)).toBe(false);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('throws a TypeError when callbackFn is not a function', () => {
    expect(() => [1].mySome({})).toThrow(TypeError);
  });
});
