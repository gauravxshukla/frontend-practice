class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        # max-heap via negated values: the heaviest stones come out first
        heap = [-s for s in stones]
        heapify(heap)
        while len(heap) > 1:
            y = -heappop(heap)  # heaviest
            x = -heappop(heap)  # second heaviest
            # equal stones both vanish; otherwise the difference survives
            if y != x:
                heappush(heap, -(y - x))
        # every stone may have been destroyed
        return -heap[0] if heap else 0
