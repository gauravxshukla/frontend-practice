class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] t : times) adj.get(t[0]).add(new int[] {t[1], t[2]});
        Map<Integer, Integer> settled = new HashMap<>(); // node -> final shortest time
        // min-heap of {time, node}: the closest unsettled node comes out first
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        heap.offer(new int[] {0, k});
        while (!heap.isEmpty()) {
            int[] top = heap.poll();
            int time = top[0];
            int node = top[1];
            // an older, longer entry for a node that's already settled
            if (settled.containsKey(node)) continue;
            settled.put(node, time);
            for (int[] e : adj.get(node)) {
                if (!settled.containsKey(e[0])) heap.offer(new int[] {time + e[1], e[0]});
            }
        }
        // the signal needs as long as the farthest node takes; unreachable nodes make it impossible
        if (settled.size() < n) return -1;
        return Collections.max(settled.values());
    }
}
