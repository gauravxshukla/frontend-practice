class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        # largest and smallest products of a subarray ending at the current index
        cur_max = cur_min = best = nums[0]
        for n in nums[1:]:
            # start fresh at n, or extend either extreme (a negative n swaps them)
            a, b = n * cur_max, n * cur_min
            cur_max = max(n, a, b)
            cur_min = min(n, a, b)
            best = max(best, cur_max)
        return best
