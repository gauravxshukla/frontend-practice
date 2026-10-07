/**
 * @param {string} s
 * @return {boolean}
 */
export default function checkValidString(s) {
  // [lo, hi] = range of possible counts of unmatched '('.
  let lo = 0;
  let hi = 0;

  for (const ch of s) {
    if (ch === '(') {
      lo++;
      hi++;
    } else if (ch === ')') {
      lo--;
      hi--;
    } else {
      lo--; // '*' as ')'
      hi++; // '*' as '('
    }
    if (hi < 0) return false; // too many ')' no matter what
    lo = Math.max(lo, 0); // a negative count is never a real option
  }
  return lo === 0;
}
