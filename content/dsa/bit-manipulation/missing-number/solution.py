class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        # indices only reach n - 1, so start with n itself
        result = len(nums)
        for i, n in enumerate(nums):
            # each present value cancels with the matching index, leaving the missing one
            result ^= i ^ n
        return result
