class KthLargest:
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        # min-heap of the k largest values seen; its top is the k-th largest
        self.heap = []
        for n in nums:
            self.add(n)

    def add(self, val: int) -> int:
        heappush(self.heap, val)
        # anything beyond the k largest can never be the answer again
        if len(self.heap) > self.k:
            heappop(self.heap)
        return self.heap[0]
