class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        m, n = len(s), len(t)
        # dp[i][j] = ways the first j chars of t appear in the first i chars of s
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        # the empty target appears exactly once in any prefix (pick nothing)
        for i in range(m + 1):
            dp[i][0] = 1
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                # skip s[i - 1] ...
                dp[i][j] = dp[i - 1][j]
                # ... or, when it matches, use it as t's j-th character
                if s[i - 1] == t[j - 1]:
                    dp[i][j] += dp[i - 1][j - 1]
        return dp[m][n]
