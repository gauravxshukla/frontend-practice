/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} head
 * @param {number} n
 * @return {ListNode | null}
 */
export default function removeNthFromEnd(head, n) {
  // a dummy before head lets us remove the head like any other node
  const dummy = { val: 0, next: head };
  let lead = dummy;
  let trail = dummy;
  // open a gap of n nodes between the two pointers
  for (let i = 0; i <= n; i++) lead = lead.next;
  // when lead falls off the end, trail is just before the node to remove
  while (lead) {
    lead = lead.next;
    trail = trail.next;
  }
  trail.next = trail.next.next;
  return dummy.next;
}
