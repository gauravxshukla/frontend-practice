/**
 * @param {string} s digits
 * @return {number}
 */
export default function numDecodings(s) {
  // ways to decode the first i - 2 and i - 1 digits
  let twoBack = 1; // empty prefix: one way (decode nothing)
  let oneBack = s[0] === '0' ? 0 : 1; // a leading zero can't be decoded
  for (let i = 2; i <= s.length; i++) {
    let ways = 0;
    // last digit on its own: any digit except 0
    if (s[i - 1] !== '0') ways += oneBack;
    // last two digits together: 10..26 (a leading 0 like "06" isn't allowed)
    const pair = Number(s.slice(i - 2, i));
    if (pair >= 10 && pair <= 26) ways += twoBack;
    twoBack = oneBack;
    oneBack = ways;
  }
  return oneBack;
}
