/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
export default function checkInclusion(s1, s2) {
  // no window of s2 is long enough
  if (s1.length > s2.length) return false;
  const need = new Array(26).fill(0); // letter counts of s1
  const have = new Array(26).fill(0); // letter counts of the current window
  for (let i = 0; i < s1.length; i++) {
    need[s1.charCodeAt(i) - 97]++;
    have[s2.charCodeAt(i) - 97]++;
  }
  // how many of the 26 letters currently have equal counts
  let matches = 0;
  for (let c = 0; c < 26; c++) if (need[c] === have[c]) matches++;

  // only the entering and leaving letters can change a match
  const update = (c, delta) => {
    if (have[c] === need[c]) matches--;
    have[c] += delta;
    if (have[c] === need[c]) matches++;
  };
  for (let r = s1.length; r < s2.length; r++) {
    if (matches === 26) return true;
    update(s2.charCodeAt(r) - 97, 1); // letter entering on the right
    update(s2.charCodeAt(r - s1.length) - 97, -1); // letter leaving on the left
  }
  // the last window hasn't been checked inside the loop
  return matches === 26;
}
