// Several substrings can tie for the longest, so accept any palindromic substring of maximal length.
export default function check(input, output) {
  const [s] = input;
  if (typeof output !== 'string' || output.length === 0 || !s.includes(output)) return false;
  for (let i = 0, j = output.length - 1; i < j; i++, j--) if (output[i] !== output[j]) return false;

  // Longest palindrome length via expand-around-centre.
  let best = 0;
  for (let c = 0; c < 2 * s.length - 1; c++) {
    let l = Math.floor(c / 2);
    let r = l + (c % 2);
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--;
      r++;
    }
    best = Math.max(best, r - l - 1);
  }
  return output.length === best;
}
