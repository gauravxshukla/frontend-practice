import mergeTwoLists from './solution.js';

// Helpers: lists are plain `{ val, next }` objects.
const fromArray = (arr) => arr.reduceRight((next, val) => ({ val, next }), null);
const toArray = (head) => {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
};

describe('mergeTwoLists', () => {
  test('both empty', () => {
    expect(mergeTwoLists(null, null)).toBe(null);
  });

  test('one empty', () => {
    expect(toArray(mergeTwoLists(null, fromArray([0])))).toEqual([0]);
  });

  test('interleaved with duplicates', () => {
    expect(toArray(mergeTwoLists(fromArray([1, 2, 4]), fromArray([1, 3, 4])))).toEqual([1, 1, 2, 3, 4, 4]);
  });

  test('different lengths', () => {
    expect(toArray(mergeTwoLists(fromArray([5]), fromArray([1, 2, 3, 6])))).toEqual([1, 2, 3, 5, 6]);
  });
});
