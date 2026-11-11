/**
 * @param {number[][]} matrix
 * @return {void} zeroes rows and columns in place
 */
export default function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  // matrix[0][0] marks row 0, so column 0 needs its own flag
  let firstColZero = false;
  // 1. record zeros in the first row/column (the markers)
  for (let r = 0; r < rows; r++) {
    if (matrix[r][0] === 0) firstColZero = true;
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  // 2. zero inner cells whose row or column is marked
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }
  // 3. the markers themselves go last, so they weren't overwritten while still needed
  if (matrix[0][0] === 0) for (let c = 0; c < cols; c++) matrix[0][c] = 0;
  if (firstColZero) for (let r = 0; r < rows; r++) matrix[r][0] = 0;
}
