class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // a dummy before head lets us remove the head like any other node
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode lead = dummy;
        ListNode trail = dummy;
        // open a gap of n nodes between the two pointers
        for (int i = 0; i <= n; i++) lead = lead.next;
        // when lead falls off the end, trail is just before the node to remove
        while (lead != null) {
            lead = lead.next;
            trail = trail.next;
        }
        trail.next = trail.next.next;
        return dummy.next;
    }
}
