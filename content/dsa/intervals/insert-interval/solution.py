class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        result = []
        start, end = newInterval
        i = 0
        # 1. intervals that end before the new one starts are untouched
        while i < len(intervals) and intervals[i][1] < start:
            result.append(intervals[i])
            i += 1
        # 2. every interval overlapping (or touching) the new one merges into it
        while i < len(intervals) and intervals[i][0] <= end:
            start = min(start, intervals[i][0])
            end = max(end, intervals[i][1])
            i += 1
        result.append([start, end])
        # 3. the rest start after the merged interval ends
        while i < len(intervals):
            result.append(intervals[i])
            i += 1
        return result
