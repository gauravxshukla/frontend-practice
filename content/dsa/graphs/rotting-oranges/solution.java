class Solution {
    public int orangesRotting(int[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        int fresh = 0;
        List<int[]> queue = new ArrayList<>(); // the oranges that rotted most recently
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1) fresh++;
                else if (grid[r][c] == 2) queue.add(new int[] {r, c});
            }
        }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        int minutes = 0;
        // each round spreads rot one step from every newly rotten orange: one minute
        while (!queue.isEmpty() && fresh > 0) {
            List<int[]> next = new ArrayList<>();
            for (int[] cell : queue) {
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0];
                    int nc = cell[1] + d[1];
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] != 1) continue;
                    grid[nr][nc] = 2;
                    fresh--;
                    next.add(new int[] {nr, nc});
                }
            }
            queue = next;
            minutes++;
        }
        // any fresh orange left was never reachable
        return fresh == 0 ? minutes : -1;
    }
}
