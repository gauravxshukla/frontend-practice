/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
export default function checkInclusion(s1, s2) {
  const n = s1.length;
  if (n > s2.length) return false;

  const need = new Array(26).fill(0);
  const window = new Array(26).fill(0);
  for (let i = 0; i < n; i++) {
    need[s1.charCodeAt(i) - 97]++;
    window[s2.charCodeAt(i) - 97]++;
  }

  // `matches` = how many of the 26 letters have equal counts in both arrays.
  let matches = 0;
  for (let c = 0; c < 26; c++) if (need[c] === window[c]) matches++;

  for (let right = n; right < s2.length; right++) {
    if (matches === 26) return true;

    // Add s2[right], remove s2[right - n], updating `matches` in O(1) each.
    const add = s2.charCodeAt(right) - 97;
    window[add]++;
    if (window[add] === need[add]) matches++;
    else if (window[add] === need[add] + 1) matches--;

    const drop = s2.charCodeAt(right - n) - 97;
    window[drop]--;
    if (window[drop] === need[drop]) matches++;
    else if (window[drop] === need[drop] - 1) matches--;
  }
  return matches === 26;
}
