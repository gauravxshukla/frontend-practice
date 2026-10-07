/**
 * @param {number[][]} matrix
 * @return {number}
 */
export default function longestIncreasingPath(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  // best[r][c] = longest strictly increasing path starting at (r, c); 0 = not computed yet.
  const best = Array.from({ length: rows }, () => new Array(cols).fill(0));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  const dfs = (r, c) => {
    if (best[r][c]) return best[r][c];
    let len = 1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c]) {
        len = Math.max(len, 1 + dfs(nr, nc));
      }
    }
    best[r][c] = len;
    return len;
  };

  let answer = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) answer = Math.max(answer, dfs(r, c));
  }
  return answer;
}
