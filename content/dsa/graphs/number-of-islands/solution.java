class Solution {
    private char[][] grid;

    public int numIslands(char[][] grid) {
        this.grid = grid;
        int islands = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                // land the scan hasn't sunk yet starts a new island
                if (grid[r][c] == '1') {
                    islands++;
                    sink(r, c);
                }
            }
        }
        return islands;
    }

    // sink every land cell connected to (r, c) so it isn't counted again
    private void sink(int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        sink(r + 1, c);
        sink(r - 1, c);
        sink(r, c + 1);
        sink(r, c - 1);
    }
}
