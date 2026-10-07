import range from './solution.js';

describe('range', () => {
  test('example: a single argument counts up from 0', () => {
    expect(range(4)).toEqual([0, 1, 2, 3]);
  });

  test('example: start, end and step', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(0, 20, 5)).toEqual([0, 5, 10, 15]);
  });

  test('a negative single argument counts down', () => {
    expect(range(-4)).toEqual([0, -1, -2, -3]);
  });

  test('explicit negative step', () => {
    expect(range(0, -4, -1)).toEqual([0, -1, -2, -3]);
  });

  test('default step is -1 when end < start', () => {
    expect(range(4, 1)).toEqual([4, 3, 2]);
  });

  test('a step of 0 repeats start', () => {
    expect(range(1, 4, 0)).toEqual([1, 1, 1]);
  });

  test('range(0) and equal bounds are empty', () => {
    expect(range(0)).toEqual([]);
    expect(range(3, 3)).toEqual([]);
  });

  test('a step pointing away from end returns []', () => {
    expect(range(1, 4, -1)).toEqual([]);
    expect(range(4, 1, 1)).toEqual([]);
  });

  test('end is excluded even when the step overshoots it', () => {
    expect(range(0, 10, 3)).toEqual([0, 3, 6, 9]);
    expect(range(0, 1, 0.25)).toEqual([0, 0.25, 0.5, 0.75]);
  });
});
