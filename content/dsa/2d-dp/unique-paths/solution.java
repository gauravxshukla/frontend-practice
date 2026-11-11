class Solution {
    public int uniquePaths(int m, int n) {
        // row[c] = paths to column c of the current row; the top row has one path per cell
        int[] row = new int[n];
        Arrays.fill(row, 1);
        for (int r = 1; r < m; r++) {
            // row[c] still holds the cell above; row[c - 1] is the cell to the left
            for (int c = 1; c < n; c++) row[c] += row[c - 1];
        }
        return row[n - 1];
    }
}
