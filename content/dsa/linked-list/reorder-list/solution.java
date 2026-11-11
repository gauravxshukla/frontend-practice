class Solution {
    public void reorderList(ListNode head) {
        if (head == null) return;
        // Find the middle, reverse the second half, then weave the halves.
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = slow.next, prev = null;
        slow.next = null;
        while (second != null) {
            ListNode next = second.next;
            second.next = prev;
            prev = second;
            second = next;
        }
        ListNode first = head;
        second = prev;
        while (second != null) {
            ListNode a = first.next, b = second.next;
            first.next = second;
            second.next = a;
            first = a;
            second = b;
        }
    }
}
