class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        result = []
        path = []

        def dfs(start: int, remaining: int) -> None:
            # the path adds up exactly to the target
            if remaining == 0:
                result.append(path[:])
                return
            # only candidates from start onwards, so each combination is built in one order
            for i in range(start, len(candidates)):
                if candidates[i] > remaining:  # would overshoot
                    continue
                path.append(candidates[i])
                dfs(i, remaining - candidates[i])  # stay at i: the same number may repeat
                path.pop()

        dfs(0, target)
        return result
