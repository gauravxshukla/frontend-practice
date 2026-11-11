class Solution {
    public int numDistinct(String s, String t) {
        int m = s.length();
        int n = t.length();
        // dp[i][j] = ways the first j chars of t appear in the first i chars of s
        int[][] dp = new int[m + 1][n + 1];
        // the empty target appears exactly once in any prefix (pick nothing)
        for (int i = 0; i <= m; i++) dp[i][0] = 1;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                // skip s[i - 1] ...
                dp[i][j] = dp[i - 1][j];
                // ... or, when it matches, use it as t's j-th character
                if (s.charAt(i - 1) == t.charAt(j - 1)) dp[i][j] += dp[i - 1][j - 1];
            }
        }
        return dp[m][n];
    }
}
