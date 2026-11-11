class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        # cheapest cost to stand on step i - 2 and step i - 1; starting on 0 or 1 is free
        two_back = one_back = 0
        # the top is step len(cost), just past the last stair
        for i in range(2, len(cost) + 1):
            # arrive from one below (paying its cost) or two below (paying that one)
            here = min(one_back + cost[i - 1], two_back + cost[i - 2])
            two_back = one_back
            one_back = here
        return one_back
