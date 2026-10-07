import myRepeat from './solution.js';

beforeAll(() => {
  String.prototype.myRepeat = myRepeat;
});
afterAll(() => {
  delete String.prototype.myRepeat;
});

describe('String.prototype.myRepeat', () => {
  test('example: repeats the string count times', () => {
    expect('ab'.myRepeat(3)).toBe('ababab');
  });

  test('example: count 0 returns an empty string', () => {
    expect('ab'.myRepeat(0)).toBe('');
  });

  test('example: a negative count throws a RangeError', () => {
    expect(() => 'ab'.myRepeat(-1)).toThrow(RangeError);
  });

  test('Infinity throws a RangeError', () => {
    expect(() => 'a'.myRepeat(Infinity)).toThrow(RangeError);
  });

  test('count 1 returns an equal string', () => {
    expect('hello'.myRepeat(1)).toBe('hello');
  });

  test.each([
    [2.9, 'xx'],
    ['2', 'xx'],
    [NaN, ''],
    [undefined, ''],
    [-0.5, ''],
    [null, ''],
  ])('coerces count %s', (count, expected) => {
    expect('x'.myRepeat(count)).toBe(expected);
    expect('x'.myRepeat(count)).toBe('x'.repeat(count));
  });

  test('repeating an empty string gives an empty string', () => {
    expect(''.myRepeat(5)).toBe('');
  });

  test('handles larger counts correctly', () => {
    const result = 'abc'.myRepeat(1000);
    expect(result).toHaveLength(3000);
    expect(result).toBe('abc'.repeat(1000));
  });
});
