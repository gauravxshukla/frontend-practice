class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        result = []
        path = []
        used = [False] * len(nums)  # which numbers are on the current path

        def dfs() -> None:
            # every position is filled
            if len(path) == len(nums):
                result.append(path[:])
                return
            for i in range(len(nums)):
                if used[i]:
                    continue
                # place nums[i] next, explore, then free it for other branches
                used[i] = True
                path.append(nums[i])
                dfs()
                path.pop()
                used[i] = False

        dfs()
        return result
