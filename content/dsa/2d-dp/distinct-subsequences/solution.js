/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
export default function numDistinct(s, t) {
  const m = s.length;
  const n = t.length;
  // dp[i][j] = ways the first j chars of t appear in the first i chars of s
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  // the empty target appears exactly once in any prefix (pick nothing)
  for (let i = 0; i <= m; i++) dp[i][0] = 1;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // skip s[i - 1] ...
      dp[i][j] = dp[i - 1][j];
      // ... or, when it matches, use it as t's j-th character
      if (s[i - 1] === t[j - 1]) dp[i][j] += dp[i - 1][j - 1];
    }
  }
  return dp[m][n];
}
