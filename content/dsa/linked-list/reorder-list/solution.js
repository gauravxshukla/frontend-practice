/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} head
 * @return {void} reorders the list in place
 */
export default function reorderList(head) {
  if (!head) return;
  // 1. find the end of the first half (slow stops at the middle)
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // 2. cut the halves apart, then reverse the second half
  let second = slow.next;
  slow.next = null;
  let prev = null;
  while (second) {
    const next = second.next;
    second.next = prev;
    prev = second;
    second = next;
  }
  // 3. weave: one node from the front half, one from the reversed back half
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
