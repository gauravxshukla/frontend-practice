/**
 * @param {string} s
 * @return {string}
 */
export default function longestPalindrome(s) {
  let bestStart = 0;
  let bestLen = 0;

  // Grow a palindrome outward from a centre while both ends match.
  const expand = (left, right) => {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    const len = right - left - 1;
    if (len > bestLen) {
      bestLen = len;
      bestStart = left + 1;
    }
  };

  for (let i = 0; i < s.length; i++) {
    expand(i, i); // odd length, centred on s[i]
    expand(i, i + 1); // even length, centred between s[i] and s[i + 1]
  }
  return s.slice(bestStart, bestStart + bestLen);
}
