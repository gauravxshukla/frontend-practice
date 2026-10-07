/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
export default function isMatch(s, p) {
  const m = s.length;
  const n = p.length;
  // match[i][j]: s[i..] is matched by p[j..]. Fill from the ends backwards.
  const match = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  match[m][n] = true;
  for (let i = m; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const firstMatches = i < m && (p[j] === s[i] || p[j] === '.');
      if (p[j + 1] === '*') {
        // Use "x*" zero times (skip it), or consume one char and stay on "x*".
        match[i][j] = match[i][j + 2] || (firstMatches && match[i + 1][j]);
      } else {
        match[i][j] = firstMatches && match[i + 1][j + 1];
      }
    }
  }
  return match[0][0];
}
