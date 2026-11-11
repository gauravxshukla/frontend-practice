class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        // fast reaching the end proves there is no loop
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            // inside a loop the faster pointer gains one step a turn, so they must meet
            if (slow == fast) return true;
        }
        return false;
    }
}
