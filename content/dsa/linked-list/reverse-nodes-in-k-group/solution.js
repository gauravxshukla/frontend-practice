/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} head
 * @param {number} k
 * @return {ListNode | null}
 */
export default function reverseKGroup(head, k) {
  const dummy = { val: 0, next: head };
  let groupPrev = dummy; // the node just before the block being reversed
  while (true) {
    // find the k-th node of this block; fewer than k left means we're done
    let kth = groupPrev;
    for (let i = 0; i < k && kth; i++) kth = kth.next;
    if (!kth) break;
    const groupNext = kth.next;
    // reverse the block, pointing its first node at whatever follows the block
    let prev = groupNext;
    let curr = groupPrev.next;
    while (curr !== groupNext) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    // the old first node is now the block's last node, before the next block
    const first = groupPrev.next;
    groupPrev.next = kth;
    groupPrev = first;
  }
  return dummy.next;
}
