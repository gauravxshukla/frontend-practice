class Solution {
    private int[][] grid;

    public int maxAreaOfIsland(int[][] grid) {
        this.grid = grid;
        int best = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 1) best = Math.max(best, area(r, c));
            }
        }
        return best;
    }

    // area of the island containing (r, c), sinking it as we count
    private int area(int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != 1) return 0;
        grid[r][c] = 0; // mark first so neighbours don't count this cell again
        return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);
    }
}
