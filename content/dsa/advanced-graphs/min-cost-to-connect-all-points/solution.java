class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length;
        boolean[] inTree = new boolean[n];
        // cheapest known edge from the growing tree to each outside point
        int[] best = new int[n];
        Arrays.fill(best, Integer.MAX_VALUE);
        best[0] = 0; // start the tree at point 0
        int total = 0;
        for (int added = 0; added < n; added++) {
            // the closest outside point joins next (Prim's greedy step)
            int u = -1;
            for (int i = 0; i < n; i++) {
                if (!inTree[i] && (u == -1 || best[i] < best[u])) u = i;
            }
            inTree[u] = true;
            total += best[u];
            // the new tree point may offer a cheaper link to the remaining points
            for (int v = 0; v < n; v++) {
                if (inTree[v]) continue;
                int cost = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
                if (cost < best[v]) best[v] = cost;
            }
        }
        return total;
    }
}
