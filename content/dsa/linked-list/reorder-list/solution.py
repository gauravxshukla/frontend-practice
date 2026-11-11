class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        if not head:
            return
        # 1. find the end of the first half (slow stops at the middle)
        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        # 2. cut the halves apart, then reverse the second half
        second = slow.next
        slow.next = None
        prev = None
        while second:
            nxt = second.next
            second.next = prev
            prev = second
            second = nxt
        # 3. weave: one node from the front half, one from the reversed back half
        first, second = head, prev
        while second:
            first_next, second_next = first.next, second.next
            first.next = second
            second.next = first_next
            first, second = first_next, second_next
