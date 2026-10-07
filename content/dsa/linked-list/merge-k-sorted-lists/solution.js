/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {(ListNode | null)[]} lists each list is sorted ascending
 * @return {ListNode | null}
 */
export default function mergeKLists(lists) {
  if (!lists.length) return null;

  // Divide and conquer: merge pairs of lists until one remains. O(N log k).
  let current = lists;
  while (current.length > 1) {
    const next = [];
    for (let i = 0; i < current.length; i += 2) {
      next.push(mergeTwo(current[i], current[i + 1] ?? null));
    }
    current = next;
  }
  return current[0];
}

function mergeTwo(a, b) {
  const dummy = { val: 0, next: null };
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a ?? b;
  return dummy.next;
}
