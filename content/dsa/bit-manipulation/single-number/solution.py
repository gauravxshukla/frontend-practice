class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        result = 0
        # pairs cancel out (a ^ a = 0), leaving the value that appears once
        for n in nums:
            result ^= n
        return result
