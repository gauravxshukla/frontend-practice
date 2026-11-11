class Solution:
    def climbStairs(self, n: int) -> int:
        # ways to stand on the step two below and one below the current one
        two_back = 1  # step 0: one way (do nothing)
        one_back = 1  # step 1: one way
        for _ in range(2, n + 1):
            # the last move was either a 1-step or a 2-step
            ways = one_back + two_back
            two_back = one_back
            one_back = ways
        return one_back
