class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        current = best = nums[0]  # all-negative input still needs a real element
        for n in nums[1:]:
            # a negative running sum can only hurt, so restart at n instead
            current = max(n, current + n)
            best = max(best, current)
        return best
