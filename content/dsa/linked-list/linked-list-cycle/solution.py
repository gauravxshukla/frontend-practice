class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        # fast reaching the end proves there is no loop
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            # inside a loop the faster pointer gains one step a turn, so they must meet
            if slow is fast:
                return True
        return False
