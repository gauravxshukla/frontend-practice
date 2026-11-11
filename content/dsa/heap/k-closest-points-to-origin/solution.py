class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        # max-heap via negated squared distance (no square root needed for ordering)
        heap = []
        for x, y in points:
            heappush(heap, (-(x * x + y * y), x, y))
            # more than k kept: the farthest can't be among the k closest
            if len(heap) > k:
                heappop(heap)
        return [[x, y] for _, x, y in heap]
