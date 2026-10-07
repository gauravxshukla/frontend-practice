import myFindIndex from './solution.js';

beforeAll(() => {
  Array.prototype.myFindIndex = myFindIndex;
});
afterAll(() => {
  delete Array.prototype.myFindIndex;
});

describe('Array.prototype.myFindIndex', () => {
  test('example: returns the index of the first match', () => {
    expect([5, 12, 8, 130].myFindIndex((n) => n > 10)).toBe(1);
  });

  test('example: returns -1 when nothing matches', () => {
    expect([5, 8].myFindIndex((n) => n > 10)).toBe(-1);
  });

  test('returns -1 for an empty array', () => {
    const spy = jest.fn(() => true);
    expect([].myFindIndex(spy)).toBe(-1);
    expect(spy).not.toHaveBeenCalled();
  });

  test('stops after the first match', () => {
    const spy = jest.fn((n) => n > 1);
    expect([1, 2, 3, 4].myFindIndex(spy)).toBe(1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('visits holes as undefined', () => {
    // eslint-disable-next-line no-sparse-arrays
    const arr = [1, , 3];
    const spy = jest.fn((v) => v === undefined);
    expect(arr.myFindIndex(spy)).toBe(1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, undefined, 1, arr);
  });

  test('visits every slot of an all-holes array', () => {
    const spy = jest.fn(() => false);
    expect(new Array(4).myFindIndex(spy)).toBe(-1);
    expect(spy).toHaveBeenCalledTimes(4);
  });

  test('uses thisArg', () => {
    const ctx = { name: 'b' };
    expect(
      ['a', 'b', 'c'].myFindIndex(function (s) {
        return s === this.name;
      }, ctx),
    ).toBe(1);
  });

  test('can find NaN with a predicate', () => {
    expect([1, NaN, 3].myFindIndex(Number.isNaN)).toBe(1);
  });

  test('throws a TypeError when callbackFn is not a function', () => {
    expect(() => [1].myFindIndex(1)).toThrow(TypeError);
  });
});
