class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        m, n = len(s1), len(s2)
        # every character of s3 must come from exactly one of the two strings
        if m + n != len(s3):
            return False
        # dp[i][j]: the first i of s1 and first j of s2 can form the first i + j of s3
        dp = [[False] * (n + 1) for _ in range(m + 1)]
        dp[0][0] = True
        for i in range(m + 1):
            for j in range(n + 1):
                # the last character of s3's prefix came from s1 ...
                if i > 0 and dp[i - 1][j] and s1[i - 1] == s3[i + j - 1]:
                    dp[i][j] = True
                # ... or from s2
                if j > 0 and dp[i][j - 1] and s2[j - 1] == s3[i + j - 1]:
                    dp[i][j] = True
        return dp[m][n]
