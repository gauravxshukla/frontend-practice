class Solution {
    private int[] parent;

    public boolean validTree(int n, int[][] edges) {
        // a tree on n nodes has exactly n - 1 edges; with that count, no cycle means connected
        if (edges.length != n - 1) return false;
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int[] e : edges) {
            int ra = find(e[0]);
            int rb = find(e[1]);
            // already connected: this edge closes a cycle
            if (ra == rb) return false;
            parent[ra] = rb;
        }
        return true;
    }

    // root of x's set, pointing nodes closer to the root as we go (path halving)
    private int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
}
