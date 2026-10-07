/**
 * O(1) extra space: the first row and column store the markers.
 * @param {number[][]} matrix
 * @return {void}
 */
export default function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const firstRowZero = matrix[0].some((v) => v === 0);
  const firstColZero = matrix.some((row) => row[0] === 0);

  // Mark rows/columns to clear in the first column/row.
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }
  // Clear the inner cells using the markers.
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
    }
  }
  // Finally the first row and column themselves.
  if (firstRowZero) for (let j = 0; j < cols; j++) matrix[0][j] = 0;
  if (firstColZero) for (let i = 0; i < rows; i++) matrix[i][0] = 0;
}
