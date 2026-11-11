class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # One pass: remember where each value was seen.
        seen = {}
        for i, num in enumerate(nums):
            if target - num in seen:
                return [seen[target - num], i]
            seen[num] = i
        return []
