class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        # standard two-list merge, splicing the smaller head each time
        def merge_two(a: Optional[ListNode], b: Optional[ListNode]) -> Optional[ListNode]:
            dummy = ListNode(0)
            tail = dummy
            while a and b:
                if a.val <= b.val:
                    tail.next = a
                    a = a.next
                else:
                    tail.next = b
                    b = b.next
                tail = tail.next
            tail.next = a if a else b
            return dummy.next

        if not lists:
            return None
        current = lists
        # merging in pairs halves the number of lists each round: log k rounds
        while len(current) > 1:
            merged = []
            for i in range(0, len(current), 2):
                # an odd list out is carried to the next round unchanged
                merged.append(merge_two(current[i], current[i + 1]) if i + 1 < len(current) else current[i])
            current = merged
        return current[0]
