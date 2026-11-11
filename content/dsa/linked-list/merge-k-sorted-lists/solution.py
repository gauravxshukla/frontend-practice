class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        # Min-heap of list heads; the index breaks ties so nodes are never compared.
        heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
        heapify(heap)
        dummy = tail = ListNode()
        while heap:
            _, i, node = heappop(heap)
            tail.next = tail = node
            if node.next:
                heappush(heap, (node.next.val, i, node.next))
        return dummy.next
