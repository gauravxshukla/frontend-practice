class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        # a dummy head means the first real node needs no special case
        dummy = ListNode(0)
        tail = dummy
        while list1 and list2:
            # the smaller head is the next node in sorted order
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        # one list is used up; the other's remainder is already sorted
        tail.next = list1 if list1 else list2
        return dummy.next
