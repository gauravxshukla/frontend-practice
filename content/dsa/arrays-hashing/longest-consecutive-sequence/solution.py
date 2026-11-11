class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        values = set(nums)  # O(1) lookups, and duplicates collapse
        best = 0
        for num in values:
            # only a run's first value starts a walk, so each value is walked once
            if num - 1 in values:
                continue
            length = 1
            # extend the run while the next value exists
            while num + length in values:
                length += 1
            best = max(best, length)
        # empty input never enters the loop, so the answer is 0
        return best
