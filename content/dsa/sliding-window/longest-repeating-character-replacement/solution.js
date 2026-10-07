/**
 * @param {string} s uppercase English letters
 * @param {number} k
 * @return {number}
 */
export default function characterReplacement(s, k) {
  const counts = new Array(26).fill(0);
  let left = 0;
  let maxFreq = 0; // highest count of one letter seen in any window so far
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    maxFreq = Math.max(maxFreq, ++counts[s.charCodeAt(right) - 65]);

    // Window needs (size - maxFreq) replacements; shrink while that exceeds k.
    while (right - left + 1 - maxFreq > k) {
      counts[s.charCodeAt(left) - 65]--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
