class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None  # the already-reversed part
        curr = head
        while curr:
            # remember the rest before cutting the link to it
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        # prev ends on the old tail, the new head (None for an empty list)
        return prev
