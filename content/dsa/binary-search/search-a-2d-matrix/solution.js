/**
 * @param {number[][]} matrix rows sorted, each row starts after the previous one ends
 * @param {number} target
 * @return {boolean}
 */
export default function searchMatrix(matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Treat the matrix as one sorted array of length rows * cols.
  let lo = 0;
  let hi = rows * cols - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    const value = matrix[Math.floor(mid / cols)][mid % cols];
    if (value === target) return true;
    if (value < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}
