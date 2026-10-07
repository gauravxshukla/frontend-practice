/**
 * Rotates the matrix 90° clockwise in place: transpose, then reverse each row.
 * @param {number[][]} matrix
 * @return {void}
 */
export default function rotate(matrix) {
  const n = matrix.length;

  // Transpose across the main diagonal (upper triangle only).
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // Mirror each row left to right.
  for (const row of matrix) row.reverse();
}
