/**
 * @param {number[][]} matrix
 * @return {number}
 */
export default function longestIncreasingPath(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  // memo[r][c] = length of the longest increasing path starting at (r, c); 0 = not computed
  const memo = Array.from({ length: rows }, () => new Array(cols).fill(0));
  const best = (r, c) => {
    if (memo[r][c]) return memo[r][c];
    let longest = 1; // the cell on its own
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      // strictly larger neighbours only, which also rules out cycles
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || matrix[nr][nc] <= matrix[r][c]) continue;
      longest = Math.max(longest, 1 + best(nr, nc));
    }
    memo[r][c] = longest;
    return longest;
  };
  let answer = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) answer = Math.max(answer, best(r, c));
  }
  return answer;
}
