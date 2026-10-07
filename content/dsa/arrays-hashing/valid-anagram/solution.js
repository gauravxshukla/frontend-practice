/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
export default function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  // Count characters of s up, characters of t down; every count must end at 0.
  const counts = new Map();
  for (let i = 0; i < s.length; i++) {
    counts.set(s[i], (counts.get(s[i]) ?? 0) + 1);
    counts.set(t[i], (counts.get(t[i]) ?? 0) - 1);
  }
  for (const c of counts.values()) {
    if (c !== 0) return false;
  }
  return true;
}
