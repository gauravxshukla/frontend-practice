/**
 * @typedef {{ val: number, next: ListNode | null }} ListNode
 * @param {ListNode | null} list1
 * @param {ListNode | null} list2
 * @return {ListNode | null}
 */
export default function mergeTwoLists(list1, list2) {
  // a dummy head means the first real node needs no special case
  const dummy = { val: 0, next: null };
  let tail = dummy;
  while (list1 && list2) {
    // the smaller head is the next node in sorted order
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  // one list is used up; the other's remainder is already sorted
  tail.next = list1 ?? list2;
  return dummy.next;
}
