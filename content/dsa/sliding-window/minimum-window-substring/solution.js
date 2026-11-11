/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
export default function minWindow(s, t) {
  if (t.length > s.length) return '';
  const need = new Map(); // char -> how many the window still needs
  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);
  let missing = t.length; // required characters not yet inside the window
  let bestStart = 0;
  let bestLen = Infinity;
  let l = 0;
  for (let r = 0; r < s.length; r++) {
    // taking a still-needed char brings the window closer to covering t
    if (need.has(s[r])) {
      if (need.get(s[r]) > 0) missing--;
      need.set(s[r], need.get(s[r]) - 1);
    }
    // covered: shrink from the left as long as it stays covered
    while (missing === 0) {
      if (r - l + 1 < bestLen) {
        bestStart = l;
        bestLen = r - l + 1;
      }
      if (need.has(s[l])) {
        need.set(s[l], need.get(s[l]) + 1);
        // dropping a char we had no spare of breaks the cover
        if (need.get(s[l]) > 0) missing++;
      }
      l++;
    }
  }
  return bestLen === Infinity ? '' : s.slice(bestStart, bestStart + bestLen);
}
