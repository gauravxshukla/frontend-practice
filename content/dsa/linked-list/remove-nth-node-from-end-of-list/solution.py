class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        # a dummy before head lets us remove the head like any other node
        dummy = ListNode(0, head)
        lead = trail = dummy
        # open a gap of n nodes between the two pointers
        for _ in range(n + 1):
            lead = lead.next
        # when lead falls off the end, trail is just before the node to remove
        while lead:
            lead = lead.next
            trail = trail.next
        trail.next = trail.next.next
        return dummy.next
