/**
 * @param {string} s
 * @return {number}
 */
export default function lengthOfLongestSubstring(s) {
  const last = new Map(); // char -> last index it appeared at
  let l = 0; // left edge of the current repeat-free window
  let best = 0;
  for (let r = 0; r < s.length; r++) {
    // a repeat inside the window forces the left edge past its previous copy
    if (last.has(s[r]) && last.get(s[r]) >= l) l = last.get(s[r]) + 1;
    last.set(s[r], r);
    best = Math.max(best, r - l + 1);
  }
  return best;
}
