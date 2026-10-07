import deepFilter from './solution.js';

const isNumber = (v) => typeof v === 'number';

describe('deepFilter', () => {
  test('example: keeps matching leaves and prunes emptied objects', () => {
    const data = { a: 1, b: { c: 'x', d: 2 }, e: [1, 'y', { f: 3 }], g: { h: 'z' } };
    expect(deepFilter(data, isNumber)).toEqual({ a: 1, b: { d: 2 }, e: [1, { f: 3 }] });
  });

  test('example: arrays are filtered element-wise and emptied arrays are dropped', () => {
    expect(deepFilter([1, [2, 'x'], ['y']], isNumber)).toEqual([1, [2]]);
  });

  test('pruning cascades through several levels', () => {
    expect(deepFilter({ a: { b: { c: 'x' } }, d: 1 }, isNumber)).toEqual({ d: 1 });
  });

  test('containers that were empty to begin with are pruned', () => {
    const result = deepFilter({ a: {}, b: [], c: 1 }, () => true);
    expect(Object.keys(result)).toEqual(['c']);
  });

  test('top level is returned empty, never removed', () => {
    expect(deepFilter({ a: 'x' }, isNumber)).toEqual({});
    const arr = deepFilter(['x'], isNumber);
    expect(Array.isArray(arr)).toBe(true);
    expect(arr).toHaveLength(0);
  });

  test('predicate is called only with leaf values', () => {
    const predicate = jest.fn(() => true);
    deepFilter({ a: 1, b: { c: [2, null] } }, predicate);
    expect(predicate).toHaveBeenCalledTimes(3);
    expect(predicate).toHaveBeenCalledWith(1);
    expect(predicate).toHaveBeenCalledWith(2);
    expect(predicate).toHaveBeenCalledWith(null);
  });

  test('null and undefined are leaves that can be kept', () => {
    const result = deepFilter({ a: null, b: undefined, c: 0 }, (v) => v == null);
    expect(Object.keys(result).sort()).toEqual(['a', 'b']);
    expect(result.a).toBeNull();
  });

  test('non-plain objects are leaves kept by reference', () => {
    const date = new Date(0);
    const result = deepFilter({ when: date, n: 'x' }, (v) => v instanceof Date);
    expect(Object.keys(result)).toEqual(['when']);
    expect(result.when).toBe(date);
  });

  test('array survivors keep their order with no holes', () => {
    const result = deepFilter({ list: ['a', 1, 'b', 2, 'c', 3] }, isNumber);
    expect(result.list).toEqual([1, 2, 3]);
    expect(result.list).toHaveLength(3);
  });

  test('returns new containers and does not mutate the input', () => {
    const input = { a: { b: 1, c: 'x' }, list: [1, 'y'] };
    const result = deepFilter(input, () => true);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
    expect(result.a).not.toBe(input.a);
    deepFilter(input, isNumber);
    expect(input).toEqual({ a: { b: 1, c: 'x' }, list: [1, 'y'] });
  });
});
