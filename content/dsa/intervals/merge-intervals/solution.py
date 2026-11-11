class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # sorted by start, an interval can only overlap the one merged just before it
        result = []
        for start, end in sorted(intervals, key=lambda iv: iv[0]):
            # overlapping (or touching): extend; max because it may already reach further
            if result and start <= result[-1][1]:
                result[-1][1] = max(result[-1][1], end)
            else:
                result.append([start, end])
        return result
