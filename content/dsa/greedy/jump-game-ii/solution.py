class Solution:
    def jump(self, nums: List[int]) -> int:
        jumps = 0
        window_end = 0  # last index reachable with the current number of jumps
        farthest = 0  # farthest index reachable with one more jump
        # the last index needs no jump out of it
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            # leaving the current window costs one jump, landing anywhere up to farthest
            if i == window_end:
                jumps += 1
                window_end = farthest
        return jumps
