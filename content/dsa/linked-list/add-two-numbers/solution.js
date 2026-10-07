/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} l1 digits in reverse order
 * @param {ListNode | null} l2 digits in reverse order
 * @return {ListNode | null} the sum, digits in reverse order
 */
export default function addTwoNumbers(l1, l2) {
  const dummy = { val: 0, next: null };
  let tail = dummy;
  let carry = 0;

  // Keep going while either list has digits or a carry is left over.
  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    tail.next = { val: sum % 10, next: null };
    tail = tail.next;
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }
  return dummy.next;
}
