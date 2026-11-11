/**
 * @param {number} n
 * @return {string[]}
 */
export default function generateParenthesis(n) {
  const result = [];
  const build = (current, open, close) => {
    // every pair is placed, and the rules below kept it valid
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    // an opener is allowed while some are still unused
    if (open < n) build(current + '(', open + 1, close);
    // a closer is allowed only if it has an unmatched opener
    if (close < open) build(current + ')', open, close + 1);
  };
  build('', 0, 0);
  return result;
}
