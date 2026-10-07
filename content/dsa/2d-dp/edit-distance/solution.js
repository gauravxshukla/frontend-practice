/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
export default function minDistance(word1, word2) {
  // d(i, j) = edits to turn word1[0..i) into word2[0..j).
  // equal last chars → d(i-1, j-1); else 1 + min(d(i-1, j) delete, d(i, j-1) insert, d(i-1, j-1) replace)
  const n = word2.length;
  const row = Array.from({ length: n + 1 }, (_, j) => j); // d(0, j) = j inserts
  for (let i = 1; i <= word1.length; i++) {
    let diag = row[0]; // d(i - 1, j - 1)
    row[0] = i; // d(i, 0) = i deletes
    for (let j = 1; j <= n; j++) {
      const above = row[j]; // d(i - 1, j)
      row[j] = word1[i - 1] === word2[j - 1] ? diag : 1 + Math.min(above, row[j - 1], diag);
      diag = above;
    }
  }
  return row[n];
}
