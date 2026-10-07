/**
 * @param {number} n
 * @return {string[]}
 */
export default function generateParenthesis(n) {
  const result = [];
  const path = [];

  // open/close = how many of each we've placed so far.
  function build(open, close) {
    if (path.length === 2 * n) {
      result.push(path.join(''));
      return;
    }
    if (open < n) {
      path.push('(');
      build(open + 1, close);
      path.pop();
    }
    if (close < open) {
      path.push(')');
      build(open, close + 1);
      path.pop();
    }
  }

  build(0, 0);
  return result;
}
