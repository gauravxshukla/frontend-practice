const isAlnum = (ch) => /[a-z0-9]/i.test(ch);

/**
 * @param {string} s
 * @return {boolean}
 */
export default function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Skip anything that is not a letter or digit.
    if (!isAlnum(s[left])) {
      left++;
    } else if (!isAlnum(s[right])) {
      right--;
    } else {
      if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
      left++;
      right--;
    }
  }
  return true;
}
