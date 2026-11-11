class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        total = sum(nums)
        # the + group must sum to (total + target) / 2, which has to be a whole, reachable number
        if abs(target) > total or (total + target) % 2 != 0:
            return 0
        goal = (total + target) // 2
        # ways[s] = subsets of the numbers so far that sum to s
        ways = [0] * (goal + 1)
        ways[0] = 1
        for num in nums:
            # downward so each number joins a subset at most once (a 0 doubles the count: +0 and -0)
            for s in range(goal, num - 1, -1):
                ways[s] += ways[s - num]
        return ways[goal]
