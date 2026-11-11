class Solution {
    private int[] parent;

    public int[] findRedundantConnection(int[][] edges) {
        // nodes are 1-indexed, so slot 0 goes unused
        parent = new int[edges.length + 1];
        for (int i = 0; i < parent.length; i++) parent[i] = i;
        for (int[] e : edges) {
            int ra = find(e[0]);
            int rb = find(e[1]);
            // already connected without this edge: it's the one that makes the cycle
            if (ra == rb) return e;
            parent[ra] = rb;
        }
        return new int[0]; // unreachable: the input always has one extra edge
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
