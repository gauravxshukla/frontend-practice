class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        # virtual balloons worth 1 on both ends act as the outer neighbours
        vals = [1] + nums + [1]
        n = len(vals)
        # dp[l][r] = best coins from bursting every balloon strictly between l and r
        dp = [[0] * n for _ in range(n)]
        # solve shorter intervals first, since longer ones are built from them
        for width in range(2, n):
            for l in range(n - width):
                r = l + width
                # k is the last balloon burst between l and r, so its neighbours are l and r
                for k in range(l + 1, r):
                    dp[l][r] = max(dp[l][r], dp[l][k] + vals[l] * vals[k] * vals[r] + dp[k][r])
        return dp[0][n - 1]
