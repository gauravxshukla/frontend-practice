class Solution {
    public void setZeroes(int[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        // matrix[0][0] marks row 0, so column 0 needs its own flag
        boolean firstColZero = false;
        // 1. record zeros in the first row/column (the markers)
        for (int r = 0; r < rows; r++) {
            if (matrix[r][0] == 0) firstColZero = true;
            for (int c = 1; c < cols; c++) {
                if (matrix[r][c] == 0) {
                    matrix[r][0] = 0;
                    matrix[0][c] = 0;
                }
            }
        }
        // 2. zero inner cells whose row or column is marked
        for (int r = 1; r < rows; r++) {
            for (int c = 1; c < cols; c++) {
                if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
            }
        }
        // 3. the markers themselves go last, so they weren't overwritten while still needed
        if (matrix[0][0] == 0) for (int c = 0; c < cols; c++) matrix[0][c] = 0;
        if (firstColZero) for (int r = 0; r < rows; r++) matrix[r][0] = 0;
    }
}
