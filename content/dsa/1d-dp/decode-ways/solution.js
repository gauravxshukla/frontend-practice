/**
 * @param {string} s
 * @return {number}
 */
export default function numDecodings(s) {
  // ways(i) = ways for the suffix s[i..].
  // ways(i) = (s[i] !== '0' ? ways(i + 1) : 0) + (s[i..i+1] is 10..26 ? ways(i + 2) : 0)
  let next = 1; // ways(i + 1), starting with ways(n) = 1 (empty suffix)
  let nextNext = 0; // ways(i + 2)
  for (let i = s.length - 1; i >= 0; i--) {
    let current = 0;
    if (s[i] !== '0') {
      current = next;
      const pair = Number(s.slice(i, i + 2));
      if (i + 1 < s.length && pair <= 26) current += nextNext;
    }
    nextNext = next;
    next = current;
  }
  return next;
}
