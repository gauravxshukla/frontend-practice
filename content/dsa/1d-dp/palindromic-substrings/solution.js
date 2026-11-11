/**
 * @param {string} s
 * @return {number}
 */
export default function countSubstrings(s) {
  // palindromes centred at (l, r): each matching step outward is one more
  const countFrom = (l, r) => {
    let count = 0;
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;
      l--;
      r++;
    }
    return count;
  };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    total += countFrom(i, i); // odd lengths, including the single letter
    total += countFrom(i, i + 1); // even lengths
  }
  return total;
}
