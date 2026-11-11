/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
export default function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  // dp[i][j] = edits to turn the first i chars of word1 into the first j chars of word2
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i; // delete everything
  for (let j = 0; j <= n; j++) dp[0][j] = j; // insert everything
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // equal last characters cost nothing extra
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      // otherwise pay for one operation on top of the cheapest smaller problem
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]); // delete, insert, replace
    }
  }
  return dp[m][n];
}
