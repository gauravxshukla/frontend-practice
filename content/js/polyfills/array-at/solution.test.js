import myAt from './solution.js';

beforeAll(() => {
  Array.prototype.myAt = myAt;
});
afterAll(() => {
  delete Array.prototype.myAt;
});

const arr = ['a', 'b', 'c'];

describe('Array.prototype.myAt', () => {
  test('example: positive indexes count from the start', () => {
    expect(arr.myAt(0)).toBe('a');
    expect(arr.myAt(2)).toBe('c');
  });

  test('example: negative indexes count from the end', () => {
    expect(arr.myAt(-1)).toBe('c');
    expect(arr.myAt(-3)).toBe('a');
  });

  test('out of range returns undefined', () => {
    expect(arr.myAt(3)).toBeUndefined();
    expect(arr.myAt(-4)).toBeUndefined();
    expect([].myAt(0)).toBeUndefined();
  });

  test.each([
    [1.7, 'b'],
    [-1.7, 'c'],
    ['1', 'b'],
    ['-2', 'b'],
    [NaN, 'a'],
    [undefined, 'a'],
    ['abc', 'a'],
    [null, 'a'],
    [true, 'b'],
  ])('coerces index %s like ToIntegerOrInfinity', (index, expected) => {
    expect(arr.myAt(index)).toBe(expected);
    expect(arr.myAt(index)).toBe(arr.at(index));
  });

  test('Infinity and -Infinity are out of range', () => {
    expect(arr.myAt(Infinity)).toBeUndefined();
    expect(arr.myAt(-Infinity)).toBeUndefined();
  });

  test('called with no argument returns the first element', () => {
    expect(arr.myAt()).toBe('a');
  });

  test('a hole at the resolved position reads as undefined', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect([1, , 3].myAt(-2)).toBeUndefined();
  });

  test('returns falsy values as-is', () => {
    expect([0, '', null].myAt(-1)).toBeNull();
    expect([0, '', null].myAt(0)).toBe(0);
  });
});
