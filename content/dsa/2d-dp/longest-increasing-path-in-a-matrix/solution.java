class Solution {
    private int[][] matrix;
    private int[][] memo; // longest increasing path starting at each cell; 0 = not computed
    private static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public int longestIncreasingPath(int[][] matrix) {
        this.matrix = matrix;
        memo = new int[matrix.length][matrix[0].length];
        int answer = 0;
        for (int r = 0; r < matrix.length; r++) {
            for (int c = 0; c < matrix[0].length; c++) answer = Math.max(answer, best(r, c));
        }
        return answer;
    }

    private int best(int r, int c) {
        if (memo[r][c] != 0) return memo[r][c];
        int longest = 1; // the cell on its own
        for (int[] d : DIRS) {
            int nr = r + d[0];
            int nc = c + d[1];
            // strictly larger neighbours only, which also rules out cycles
            if (nr < 0 || nr >= matrix.length || nc < 0 || nc >= matrix[0].length || matrix[nr][nc] <= matrix[r][c]) continue;
            longest = Math.max(longest, 1 + best(nr, nc));
        }
        memo[r][c] = longest;
        return longest;
    }
}
