/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
export default function numDistinct(s, t) {
  // ways(i, j) = number of ways s[0..i) contains t[0..j) as a subsequence.
  // ways(i, j) = ways(i - 1, j) + (s[i-1] === t[j-1] ? ways(i - 1, j - 1) : 0)
  const ways = new Array(t.length + 1).fill(0);
  ways[0] = 1; // the empty target is matched exactly once
  for (let i = 1; i <= s.length; i++) {
    // Sweep j downward so ways[j - 1] still holds the previous row.
    for (let j = Math.min(i, t.length); j >= 1; j--) {
      if (s[i - 1] === t[j - 1]) ways[j] += ways[j - 1];
    }
  }
  return ways[t.length];
}
