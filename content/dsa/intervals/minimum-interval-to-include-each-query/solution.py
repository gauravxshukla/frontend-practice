class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        ordered = sorted(intervals, key=lambda iv: iv[0])
        answer = [-1] * len(queries)
        # min-heap of (size, right) for intervals that have started
        heap = []
        i = 0
        # answer queries smallest first, remembering where each answer goes
        for q, idx in sorted((q, idx) for idx, q in enumerate(queries)):
            # every interval starting at or before q might contain it
            while i < len(ordered) and ordered[i][0] <= q:
                left, right = ordered[i]
                heappush(heap, (right - left + 1, right))
                i += 1
            # intervals ending before q can't contain this or any later query
            while heap and heap[0][1] < q:
                heappop(heap)
            if heap:
                answer[idx] = heap[0][0]
        return answer
