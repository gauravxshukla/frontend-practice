/**
 * @param {string} s
 * @param {string} p pattern with '.' and '*'
 * @return {boolean}
 */
export default function isMatch(s, p) {
  const m = s.length;
  const n = p.length;
  // dp[i][j]: s[i..] matches p[j..]
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[m][n] = true; // both used up
  for (let i = m; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      // does the current pattern character match s[i]? (never past the end of s)
      const first = i < m && (p[j] === s[i] || p[j] === '.');
      if (j + 1 < n && p[j + 1] === '*') {
        // "x*": use it zero times (skip both chars), or once and stay on it
        dp[i][j] = dp[i][j + 2] || (first && dp[i + 1][j]);
      } else {
        dp[i][j] = first && dp[i + 1][j + 1];
      }
    }
  }
  return dp[0][0];
}
