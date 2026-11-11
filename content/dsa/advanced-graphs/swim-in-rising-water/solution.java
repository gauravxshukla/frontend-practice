class Solution {
    public int swimInWater(int[][] grid) {
        int n = grid.length;
        boolean[][] seen = new boolean[n][n];
        // min-heap of {highest elevation on the path so far, r, c}
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        heap.offer(new int[] {grid[0][0], 0, 0}); // the start cell's height counts too
        seen[0][0] = true;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!heap.isEmpty()) {
            int[] top = heap.poll();
            int time = top[0];
            // popped in order of path maximum, so the first arrival is the best
            if (top[1] == n - 1 && top[2] == n - 1) return time;
            for (int[] d : dirs) {
                int nr = top[1] + d[0];
                int nc = top[2] + d[1];
                if (nr < 0 || nr >= n || nc < 0 || nc >= n || seen[nr][nc]) continue;
                seen[nr][nc] = true;
                // stepping onto a higher cell raises the time needed for this path
                heap.offer(new int[] {Math.max(time, grid[nr][nc]), nr, nc});
            }
        }
        return -1; // unreachable: the grid is always connected
    }
}
