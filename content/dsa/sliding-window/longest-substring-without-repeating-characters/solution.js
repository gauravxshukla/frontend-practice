/**
 * @param {string} s
 * @return {number}
 */
export default function lengthOfLongestSubstring(s) {
  const lastSeen = new Map(); // char -> last index it appeared at
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    // If ch repeats inside the window, jump left past its previous position.
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
