/**
 * @param {string} s uppercase letters
 * @param {number} k
 * @return {number}
 */
export default function characterReplacement(s, k) {
  const counts = new Array(26).fill(0); // letter counts inside the window
  let l = 0;
  let maxFreq = 0; // highest single-letter count the window has reached
  let best = 0;
  for (let r = 0; r < s.length; r++) {
    // the new letter may become the one we keep, so update the max
    maxFreq = Math.max(maxFreq, ++counts[s.charCodeAt(r) - 65]);
    // every other letter must be replaced; more than k means shrink
    while (r - l + 1 - maxFreq > k) {
      counts[s.charCodeAt(l) - 65]--;
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}
