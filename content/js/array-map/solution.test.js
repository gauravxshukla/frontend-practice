import myMap from './solution.js';

beforeAll(() => {
  Array.prototype.myMap = myMap;
});
afterAll(() => {
  delete Array.prototype.myMap;
});

describe('Array.prototype.myMap', () => {
  test('maps every element', () => {
    expect([1, 2, 3].myMap((n) => n * 2)).toEqual([2, 4, 6]);
  });

  test('passes value, index and array', () => {
    const arr = [10, 20];
    expect(arr.myMap((v, i, a) => `${v}:${i}:${a === arr}`)).toEqual(['10:0:true', '20:1:true']);
  });

  test('uses thisArg', () => {
    expect([1, 2].myMap(function (n) { return n * this.factor; }, { factor: 3 })).toEqual([3, 6]);
  });

  test('preserves holes and length', () => {
    let calls = 0;
    // eslint-disable-next-line no-sparse-arrays
    const result = [1, , 3, ,].myMap((n) => { calls++; return n; });
    expect(calls).toBe(2);
    expect(result.length).toBe(4);
    expect(1 in result).toBe(false);
  });
});
