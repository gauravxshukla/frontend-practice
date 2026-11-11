/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
export default function wordBreak(s, wordDict) {
  // ok[i]: the first i characters can be split into dictionary words
  const ok = new Array(s.length + 1).fill(false);
  ok[0] = true; // the empty prefix needs no words
  for (let i = 1; i <= s.length; i++) {
    for (const w of wordDict) {
      // w can be the last word of the prefix if the part before it already splits
      if (w.length <= i && ok[i - w.length] && s.startsWith(w, i - w.length)) {
        ok[i] = true;
        break;
      }
    }
  }
  return ok[s.length];
}
