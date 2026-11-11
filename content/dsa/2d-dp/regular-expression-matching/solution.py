class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s), len(p)
        # dp[i][j]: s[i:] matches p[j:]
        dp = [[False] * (n + 1) for _ in range(m + 1)]
        dp[m][n] = True  # both used up
        for i in range(m, -1, -1):
            for j in range(n - 1, -1, -1):
                # does the current pattern character match s[i]? (never past the end of s)
                first = i < m and (p[j] == s[i] or p[j] == ".")
                if j + 1 < n and p[j + 1] == "*":
                    # "x*": use it zero times (skip both chars), or once and stay on it
                    dp[i][j] = dp[i][j + 2] or (first and dp[i + 1][j])
                else:
                    dp[i][j] = first and dp[i + 1][j + 1]
        return dp[0][0]
