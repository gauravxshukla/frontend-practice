/**
 * @param {string} s1
 * @param {string} s2
 * @param {string} s3
 * @return {boolean}
 */
export default function isInterleave(s1, s2, s3) {
  const m = s1.length;
  const n = s2.length;
  // every character of s3 must come from exactly one of the two strings
  if (m + n !== s3.length) return false;
  // dp[i][j]: the first i of s1 and first j of s2 can form the first i + j of s3
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      const next = s3[i + j - 1];
      // the last character of s3's prefix came from s1 ...
      if (i > 0 && dp[i - 1][j] && s1[i - 1] === next) dp[i][j] = true;
      // ... or from s2
      if (j > 0 && dp[i][j - 1] && s2[j - 1] === next) dp[i][j] = true;
    }
  }
  return dp[m][n];
}
