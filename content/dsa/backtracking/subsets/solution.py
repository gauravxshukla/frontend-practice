class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        result = []
        path = []  # the subset being built

        def dfs(i: int) -> None:
            # every element has been decided: record this subset (as a copy)
            if i == len(nums):
                result.append(path[:])
                return
            # choice 1: include nums[i]
            path.append(nums[i])
            dfs(i + 1)
            path.pop()  # undo before the other choice
            # choice 2: skip nums[i]
            dfs(i + 1)

        dfs(0)
        return result
