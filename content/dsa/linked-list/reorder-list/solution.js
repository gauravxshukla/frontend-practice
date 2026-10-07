/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} head
 * @return {void} rearrange the nodes in place
 */
export default function reorderList(head) {
  if (!head || !head.next) return;

  // 1. Find the middle (slow ends at the last node of the first half).
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. Cut the list and reverse the second half.
  let second = slow.next;
  slow.next = null;
  let prev = null;
  while (second) {
    const next = second.next;
    second.next = prev;
    prev = second;
    second = next;
  }

  // 3. Weave the two halves together.
  let first = head;
  second = prev;
  while (second) {
    const firstNext = first.next;
    const secondNext = second.next;
    first.next = second;
    second.next = firstNext;
    first = firstNext;
    second = secondNext;
  }
}
