class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length();
        int n = p.length();
        // dp[i][j]: s[i..] matches p[j..]
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[m][n] = true; // both used up
        for (int i = m; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                // does the current pattern character match s[i]? (never past the end of s)
                boolean first = i < m && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');
                if (j + 1 < n && p.charAt(j + 1) == '*') {
                    // "x*": use it zero times (skip both chars), or once and stay on it
                    dp[i][j] = dp[i][j + 2] || (first && dp[i + 1][j]);
                } else {
                    dp[i][j] = first && dp[i + 1][j + 1];
                }
            }
        }
        return dp[0][0];
    }
}
