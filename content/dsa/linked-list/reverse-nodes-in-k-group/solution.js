/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} head
 * @param {number} k group size
 * @return {ListNode | null}
 */
export default function reverseKGroup(head, k) {
  const dummy = { val: 0, next: head };
  let groupPrev = dummy; // node just before the current group

  while (true) {
    // Find the k-th node of this group. If the group is short, leave it as is.
    let kth = groupPrev;
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break;
    const groupNext = kth.next;

    // Reverse the group, pointing its old first node at groupNext.
    let prev = groupNext;
    let curr = groupPrev.next;
    while (curr !== groupNext) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }

    // Reconnect: the old first node is now the group's tail.
    const oldFirst = groupPrev.next;
    groupPrev.next = kth;
    groupPrev = oldFirst;
  }
  return dummy.next;
}
