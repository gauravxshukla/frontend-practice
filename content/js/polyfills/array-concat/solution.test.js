import myConcat from './solution.js';

beforeAll(() => {
  Array.prototype.myConcat = myConcat;
});
afterAll(() => {
  delete Array.prototype.myConcat;
});

describe('Array.prototype.myConcat', () => {
  test('example: spreads arrays one level and appends values', () => {
    expect([1, 2].myConcat([3, 4], 5, [[6]])).toEqual([1, 2, 3, 4, 5, [6]]);
  });

  test('example: no arguments returns a new copy', () => {
    const arr = [1];
    const result = arr.myConcat();
    expect(result).toEqual([1]);
    expect(result).not.toBe(arr);
  });

  test('does not flatten nested arrays', () => {
    const nested = [2, [3, [4]]];
    const result = [1].myConcat(nested);
    expect(result).toEqual([1, 2, [3, [4]]]);
    expect(result[2]).toBe(nested[1]);
  });

  test('appends non-array values as single elements', () => {
    const obj = { a: 1 };
    const arrayLike = { length: 2, 0: 'x', 1: 'y' };
    const result = [].myConcat('ab', obj, null, undefined, arrayLike);
    expect(result).toHaveLength(5);
    expect(result[0]).toBe('ab');
    expect(result[1]).toBe(obj);
    expect(result[2]).toBeNull();
    expect(result[3]).toBeUndefined();
    expect(result[4]).toBe(arrayLike);
  });

  test('preserves holes from this and from arguments', () => {
    // eslint-disable-next-line no-sparse-arrays
    const result = [1, , 3].myConcat([4, , 6]);
    expect(result).toHaveLength(6);
    expect(1 in result).toBe(false);
    expect(4 in result).toBe(false);
    expect(result[5]).toBe(6);
  });

  test('keeps trailing holes in the length', () => {
    const result = [1].myConcat(new Array(2));
    expect(result).toHaveLength(3);
    expect(2 in result).toBe(false);
  });

  test('does not mutate the original array or arguments', () => {
    const a = [1, 2];
    const b = [3];
    a.myConcat(b, 4);
    expect(a).toEqual([1, 2]);
    expect(b).toEqual([3]);
  });

  test('handles empty arrays', () => {
    expect([].myConcat([], [])).toEqual([]);
    expect([].myConcat([], [1])).toEqual([1]);
  });

  test('matches native concat', () => {
    const args = [[1, [2]], 'x', { k: 1 }, [], [null, undefined]];
    expect([0].myConcat(...args)).toEqual([0].concat(...args));
  });
});
