/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
export default function isAnagram(s, t) {
  // different lengths can never use the same letters
  if (s.length !== t.length) return false;
  const counts = new Array(26).fill(0); // one counter per letter a-z
  for (let i = 0; i < s.length; i++) {
    // s adds a letter, t takes one away; anagrams cancel out exactly
    counts[s.charCodeAt(i) - 97]++;
    counts[t.charCodeAt(i) - 97]--;
  }
  // any non-zero counter is a letter one string has more of
  return counts.every((c) => c === 0);
}
