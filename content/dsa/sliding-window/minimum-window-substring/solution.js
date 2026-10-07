/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
export default function minWindow(s, t) {
  if (t.length > s.length) return '';

  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);
  let missing = t.length; // characters of t (with multiplicity) not yet covered

  let left = 0;
  let bestStart = 0;
  let bestLength = Infinity;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (need.has(ch)) {
      if (need.get(ch) > 0) missing--;
      need.set(ch, need.get(ch) - 1); // may go negative: surplus copies
    }

    // Window is valid: shrink from the left as far as possible.
    while (missing === 0) {
      if (right - left + 1 < bestLength) {
        bestStart = left;
        bestLength = right - left + 1;
      }
      const out = s[left];
      if (need.has(out)) {
        need.set(out, need.get(out) + 1);
        if (need.get(out) > 0) missing++;
      }
      left++;
    }
  }
  return bestLength === Infinity ? '' : s.slice(bestStart, bestStart + bestLength);
}
