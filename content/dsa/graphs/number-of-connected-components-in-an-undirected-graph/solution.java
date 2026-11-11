class Solution {
    private int[] parent;

    public int countComponents(int n, int[][] edges) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int components = n; // every node starts on its own
        for (int[] e : edges) {
            int ra = find(e[0]);
            int rb = find(e[1]);
            // joining two different groups leaves one fewer; same group changes nothing
            if (ra != rb) {
                parent[ra] = rb;
                components--;
            }
        }
        return components;
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
