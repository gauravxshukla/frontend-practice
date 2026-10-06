/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} list1
 * @param {ListNode | null} list2
 * @return {ListNode | null}
 */
export default function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let tail = dummy;
  let a = list1;
  let b = list2;

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
