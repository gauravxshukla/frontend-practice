/**
 * @param {number} m rows
 * @param {number} n columns
 * @return {number}
 */
export default function uniquePaths(m, n) {
  // row[c] = paths to column c of the current row; the top row has one path per cell
  const row = new Array(n).fill(1);
  for (let r = 1; r < m; r++) {
    // row[c] still holds the cell above; row[c - 1] is the cell to the left
    for (let c = 1; c < n; c++) row[c] += row[c - 1];
  }
  return row[n - 1];
}
