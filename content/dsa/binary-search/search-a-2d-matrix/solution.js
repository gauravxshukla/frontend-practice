/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
export default function searchMatrix(matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  // read row by row, the matrix is one sorted list of rows * cols values
  let l = 0;
  let r = rows * cols - 1;
  while (l <= r) {
    const mid = l + Math.floor((r - l) / 2);
    // turn the flat index back into a cell
    const value = matrix[Math.floor(mid / cols)][mid % cols];
    if (value === target) return true;
    if (value < target) l = mid + 1;
    else r = mid - 1;
  }
  return false;
}
