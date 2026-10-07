/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
export default function longestCommonSubsequence(text1, text2) {
  // lcs(i, j) for prefixes text1[0..i), text2[0..j):
  //   chars match → lcs(i - 1, j - 1) + 1, otherwise max(lcs(i - 1, j), lcs(i, j - 1)).
  const n = text2.length;
  let prev = new Array(n + 1).fill(0);
  for (let i = 1; i <= text1.length; i++) {
    const curr = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      curr[j] = text1[i - 1] === text2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1]);
    }
    prev = curr;
  }
  return prev[n];
}
