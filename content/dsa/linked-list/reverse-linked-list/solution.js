/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} head
 * @return {ListNode | null}
 */
export default function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
