/**
 * @param {string} s
 * @return {boolean}
 */
export default function isPalindrome(s) {
  const isAlnum = (ch) => /[a-z0-9]/i.test(ch);
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    // symbols and spaces don't count, so step over them
    if (!isAlnum(s[l])) {
      l++;
    } else if (!isAlnum(s[r])) {
      r--;
    } else {
      // the mirrored characters must match, ignoring case
      if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
      l++;
      r--;
    }
  }
  // pointers met without a mismatch (also true for empty or all-symbol input)
  return true;
}
