class Solution {
    public int[] spiralOrder(int[][] matrix) {
        int[] result = new int[matrix.length * matrix[0].length];
        int k = 0;
        // the unread part is always the rectangle between these four bounds
        int top = 0;
        int bottom = matrix.length - 1;
        int left = 0;
        int right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int c = left; c <= right; c++) result[k++] = matrix[top][c];
            top++;
            for (int r = top; r <= bottom; r++) result[k++] = matrix[r][right];
            right--;
            // a single remaining row was already read left to right
            if (top <= bottom) {
                for (int c = right; c >= left; c--) result[k++] = matrix[bottom][c];
                bottom--;
            }
            // a single remaining column was already read top to bottom
            if (left <= right) {
                for (int r = bottom; r >= top; r--) result[k++] = matrix[r][left];
                left++;
            }
        }
        return result;
    }
}
