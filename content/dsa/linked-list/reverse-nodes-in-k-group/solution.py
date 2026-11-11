class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        group_prev = dummy  # the node just before the block being reversed
        while True:
            # find the k-th node of this block; fewer than k left means we're done
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next
            group_next = kth.next
            # reverse the block, pointing its first node at whatever follows the block
            prev, curr = group_next, group_prev.next
            while curr is not group_next:
                nxt = curr.next
                curr.next = prev
                prev = curr
                curr = nxt
            # the old first node is now the block's last node, before the next block
            first = group_prev.next
            group_prev.next = kth
            group_prev = first
