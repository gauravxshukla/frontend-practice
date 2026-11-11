/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
export default function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  // dp[i][j] = LCS of the first i chars of text1 and first j chars of text2 (row/col 0 = empty)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // matching last characters extend the LCS of both shorter prefixes
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      // otherwise drop the last char of one string or the other
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}
