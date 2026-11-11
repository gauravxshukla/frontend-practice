/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */
export default function reverseList(head) {
  let prev = null; // the already-reversed part
  let curr = head;
  while (curr) {
    // remember the rest before cutting the link to it
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  // prev ends on the old tail, the new head (null for an empty list)
  return prev;
}
