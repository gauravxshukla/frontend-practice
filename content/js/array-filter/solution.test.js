import myFilter from './solution.js';

beforeAll(() => {
  Array.prototype.myFilter = myFilter;
});
afterAll(() => {
  delete Array.prototype.myFilter;
});

describe('Array.prototype.myFilter', () => {
  test('keeps truthy results', () => {
    expect([1, 2, 3, 4].myFilter((n) => n % 2 === 0)).toEqual([2, 4]);
  });

  test('passes value, index and array', () => {
    const arr = ['a', 'b'];
    const calls = [];
    arr.myFilter((v, i, a) => calls.push([v, i, a === arr]));
    expect(calls).toEqual([['a', 0, true], ['b', 1, true]]);
  });

  test('uses thisArg', () => {
    const ctx = { min: 2 };
    expect([1, 2, 3].myFilter(function (n) { return n >= this.min; }, ctx)).toEqual([2, 3]);
  });

  test('skips holes in sparse arrays', () => {
    let calls = 0;
    // eslint-disable-next-line no-sparse-arrays
    [1, , 3].myFilter(() => { calls++; return true; });
    expect(calls).toBe(2);
  });

  test('does not mutate the original', () => {
    const arr = [1, 2, 3];
    arr.myFilter(() => false);
    expect(arr).toEqual([1, 2, 3]);
  });
});
