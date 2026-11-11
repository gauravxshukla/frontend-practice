/**
 * @param {string} s
 * @return {string}
 */
export default function longestPalindrome(s) {
  let start = 0;
  let length = 0;
  // grow outward from a centre while both ends match
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--;
      r++;
    }
    // the loop overshot by one on each side
    if (r - l - 1 > length) {
      start = l + 1;
      length = r - l - 1;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i); // odd length: centred on a letter
    expand(i, i + 1); // even length: centred between two letters
  }
  return s.slice(start, start + length);
}
