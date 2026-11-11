/**
 * @param {string} s '(', ')' and '*'
 * @return {boolean}
 */
export default function checkValidString(s) {
  // fewest and most unmatched '(' possible after reading each prefix
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
      lo--; // '*' read as ')'
      hi++; // '*' read as '('
    }
    // even treating every '*' as '(' can't cover the ')'s seen
    if (hi < 0) return false;
    // a negative count isn't a real option: those '*' would have been empty instead
    lo = Math.max(lo, 0);
  }
  // some choice of '*'s closes every '('
  return lo === 0;
}
