import reverseList from './solution.js';

// Helpers: lists are plain `{ val, next }` objects.
const fromArray = (arr) => arr.reduceRight((next, val) => ({ val, next }), null);
const toArray = (head) => {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
};

describe('reverseList', () => {
  test('empty list', () => {
    expect(reverseList(null)).toBe(null);
  });

  test('single node', () => {
    expect(toArray(reverseList(fromArray([1])))).toEqual([1]);
  });

  test('several nodes', () => {
    expect(toArray(reverseList(fromArray([1, 2, 3, 4])))).toEqual([4, 3, 2, 1]);
  });

  test('reuses the same nodes', () => {
    const head = fromArray([1, 2]);
    const tail = head.next;
    expect(reverseList(head)).toBe(tail);
  });
});
