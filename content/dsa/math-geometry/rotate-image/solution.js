/**
 * @param {number[][]} matrix n x n
 * @return {void} rotates in place
 */
export default function rotate(matrix) {
  const n = matrix.length;
  // 1. transpose: swap across the main diagonal (upper triangle only, or pairs swap back)
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) {
      [matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]];
    }
  }
  // 2. mirror each row left to right; together the two steps are a clockwise turn
  for (const row of matrix) row.reverse();
}
