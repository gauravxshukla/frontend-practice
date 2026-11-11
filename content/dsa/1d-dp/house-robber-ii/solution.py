class Solution:
    def rob(self, nums: List[int]) -> int:
        # with one house there is no neighbour conflict to split around
        if len(nums) == 1:
            return nums[0]

        # straight-line House Robber over nums[lo..hi]
        def rob_line(lo: int, hi: int) -> int:
            two_back = one_back = 0
            for i in range(lo, hi + 1):
                best = max(one_back, two_back + nums[i])
                two_back = one_back
                one_back = best
            return one_back

        # the first and last houses touch, so at least one of them is left out
        return max(rob_line(0, len(nums) - 2), rob_line(1, len(nums) - 1))
