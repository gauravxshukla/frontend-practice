import flatten from './solution.js';

describe('flatten', () => {
  test('already flat', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('deeply nested', () => {
    expect(flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5]);
  });

  test('empty arrays disappear', () => {
    expect(flatten([[], [[]], 1, [[[]]]])).toEqual([1]);
  });

  test('keeps objects as items', () => {
    const obj = { a: [1] };
    expect(flatten([obj, [obj]])).toEqual([obj, obj]);
  });

  test('does not mutate input', () => {
    const input = [1, [2, [3]]];
    flatten(input);
    expect(input).toEqual([1, [2, [3]]]);
  });
});
