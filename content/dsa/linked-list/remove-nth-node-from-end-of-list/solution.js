/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} head
 * @param {number} n 1-based position counted from the end
 * @return {ListNode | null}
 */
export default function removeNthFromEnd(head, n) {
  // A dummy node makes removing the head the same as removing any other node.
  const dummy = { val: 0, next: head };
  let fast = dummy;
  let slow = dummy;

  // Put fast n + 1 steps ahead, so slow stops right before the target.
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}
