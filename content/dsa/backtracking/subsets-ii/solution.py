class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        # sorting puts equal values side by side so repeats are easy to skip
        nums = sorted(nums)
        result = []
        path = []

        def dfs(start: int) -> None:
            # every path, including the empty one, is a subset
            result.append(path[:])
            for i in range(start, len(nums)):
                # the same value at the same depth would build the same subsets again
                if i > start and nums[i] == nums[i - 1]:
                    continue
                path.append(nums[i])
                dfs(i + 1)
                path.pop()

        dfs(0)
        return result
