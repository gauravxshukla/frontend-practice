/**
 * @param {string} s
 * @return {number}
 */
export default function countSubstrings(s) {
  let count = 0;
  // Every palindrome has an odd centre (a character) or an even centre (a gap).
  for (let centre = 0; centre < 2 * s.length - 1; centre++) {
    let left = Math.floor(centre / 2);
    let right = left + (centre % 2);
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++; // each successful expansion is one more palindrome
      left--;
      right++;
    }
  }
  return count;
}
