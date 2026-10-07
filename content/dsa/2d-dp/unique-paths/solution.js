/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
export default function uniquePaths(m, n) {
  // paths[r][c] = paths[r - 1][c] + paths[r][c - 1]; one row is enough.
  const row = new Array(n).fill(1); // the top row: one way to reach each cell
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1]; // row[c] still holds the value from the row above
    }
  }
  return row[n - 1];
}
