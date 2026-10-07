/**
 * @param {string} s1
 * @param {string} s2
 * @param {string} s3
 * @return {boolean}
 */
export default function isInterleave(s1, s2, s3) {
  const m = s1.length;
  const n = s2.length;
  if (m + n !== s3.length) return false;
  // ok(i, j): s1[0..i) and s2[0..j) interleave to s3[0..i+j).
  // ok(i, j) = (ok(i - 1, j) && s1[i-1] === s3[i+j-1]) || (ok(i, j - 1) && s2[j-1] === s3[i+j-1])
  const ok = new Array(n + 1).fill(false);
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0 && j === 0) {
        ok[0] = true;
        continue;
      }
      const fromS1 = i > 0 && ok[j] && s1[i - 1] === s3[i + j - 1]; // ok[j] is still row i - 1
      const fromS2 = j > 0 && ok[j - 1] && s2[j - 1] === s3[i + j - 1]; // ok[j - 1] is already row i
      ok[j] = fromS1 || fromS2;
    }
  }
  return ok[n];
}
