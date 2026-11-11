class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // a dummy head means the first real node needs no special case
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (list1 != null && list2 != null) {
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
        tail.next = list1 != null ? list1 : list2;
        return dummy.next;
    }
}
