class Solution {
    private int[][] heights;
    private static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        this.heights = heights;
        int rows = heights.length;
        int cols = heights[0].length;
        boolean[][] pacific = new boolean[rows][cols];
        boolean[][] atlantic = new boolean[rows][cols];
        // top/left edges touch the Pacific, bottom/right edges the Atlantic
        for (int r = 0; r < rows; r++) {
            climb(r, 0, pacific);
            climb(r, cols - 1, atlantic);
        }
        for (int c = 0; c < cols; c++) {
            climb(0, c, pacific);
            climb(rows - 1, c, atlantic);
        }
        List<List<Integer>> result = new ArrayList<>();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) if (pacific[r][c] && atlantic[r][c]) result.add(Arrays.asList(r, c));
        }
        return result;
    }

    // climb from the ocean: a neighbour at least as high can drain into this cell
    private void climb(int r, int c, boolean[][] seen) {
        seen[r][c] = true;
        for (int[] d : DIRS) {
            int nr = r + d[0];
            int nc = c + d[1];
            if (nr < 0 || nr >= heights.length || nc < 0 || nc >= heights[0].length || seen[nr][nc]) continue;
            if (heights[nr][nc] >= heights[r][c]) climb(nr, nc, seen);
        }
    }
}
