class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        // read row by row, the matrix is one sorted list of rows * cols values
        int l = 0;
        int r = rows * cols - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            // turn the flat index back into a cell
            int value = matrix[mid / cols][mid % cols];
            if (value == target) return true;
            if (value < target) l = mid + 1;
            else r = mid - 1;
        }
        return false;
    }
}
