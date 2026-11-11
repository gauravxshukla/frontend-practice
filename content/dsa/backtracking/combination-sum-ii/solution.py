class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        # sorting puts equal values side by side and lets us stop early
        nums = sorted(candidates)
        result = []
        path = []

        def dfs(start: int, remaining: int) -> None:
            if remaining == 0:
                result.append(path[:])
                return
            for i in range(start, len(nums)):
                # the same value at the same depth would rebuild combinations already found
                if i > start and nums[i] == nums[i - 1]:
                    continue
                # sorted, so every later value overshoots too
                if nums[i] > remaining:
                    break
                path.append(nums[i])
                dfs(i + 1, remaining - nums[i])  # i + 1: each element is used at most once
                path.pop()

        dfs(0, target)
        return result
