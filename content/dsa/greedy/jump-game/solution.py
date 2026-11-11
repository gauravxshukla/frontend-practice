class Solution:
    def canJump(self, nums: List[int]) -> bool:
        reach = 0  # farthest index we know we can land on
        for i, n in enumerate(nums):
            # i is beyond anything reachable, so the end is too
            if i > reach:
                return False
            reach = max(reach, i + n)
        return True
