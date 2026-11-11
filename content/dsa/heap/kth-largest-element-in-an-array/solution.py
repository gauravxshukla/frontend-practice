class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        # min-heap of the k largest values seen so far
        heap = []
        for n in nums:
            heappush(heap, n)
            # the smallest of k + 1 values can't be among the k largest
            if len(heap) > k:
                heappop(heap)
        # the smallest of the k largest is the k-th largest
        return heap[0]
