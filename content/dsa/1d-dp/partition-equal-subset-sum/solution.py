class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        # an odd total can't be split into two equal integer halves
        if total % 2 != 0:
            return False
        target = total // 2
        # can[s]: some subset of the numbers seen so far sums to s
        can = [False] * (target + 1)
        can[0] = True
        for num in nums:
            # go downward so this num is used at most once per pass
            for s in range(target, num - 1, -1):
                if can[s - num]:
                    can[s] = True
        return can[target]
