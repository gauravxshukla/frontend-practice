class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null; // the already-reversed part
        ListNode curr = head;
        while (curr != null) {
            // remember the rest before cutting the link to it
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        // prev ends on the old tail, the new head (null for an empty list)
        return prev;
    }
}
