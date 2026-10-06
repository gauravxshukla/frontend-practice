import hasCycle from './solution.js';

// Helpers: lists are plain `{ val, next }` objects.
const fromArray = (arr) => arr.reduceRight((next, val) => ({ val, next }), null);
const toArray = (head) => {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
};

const withCycle = (arr, pos) => {
  const head = fromArray(arr);
  let tail = head;
  let target = null;
  for (let i = 0; tail.next; i++, tail = tail.next) if (i === pos) target = tail;
  tail.next = pos === arr.length - 1 ? tail : target;
  return head;
};

describe('hasCycle', () => {
  test('empty', () => {
    expect(hasCycle(null)).toBe(false);
  });

  test('no cycle', () => {
    expect(hasCycle(fromArray([1, 2, 3, 4]))).toBe(false);
  });

  test('cycle back to the head', () => {
    expect(hasCycle(withCycle([1, 2, 3], 0))).toBe(true);
  });

  test('cycle in the middle', () => {
    expect(hasCycle(withCycle([3, 2, 0, -4], 1))).toBe(true);
  });

  test('single node pointing to itself', () => {
    expect(hasCycle(withCycle([1], 0))).toBe(true);
  });
});
