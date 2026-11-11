class Solution {
    public int[] minInterval(int[][] intervals, int[] queries) {
        int[][] sorted = intervals.clone();
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));
        // answer queries smallest first, remembering where each answer goes
        Integer[] order = new Integer[queries.length];
        for (int k = 0; k < order.length; k++) order[k] = k;
        Arrays.sort(order, (a, b) -> Integer.compare(queries[a], queries[b]));
        int[] answer = new int[queries.length];
        Arrays.fill(answer, -1);
        // min-heap of {size, right} for intervals that have started
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        int i = 0;
        for (int idx : order) {
            int q = queries[idx];
            // every interval starting at or before q might contain it
            while (i < sorted.length && sorted[i][0] <= q) {
                heap.offer(new int[] {sorted[i][1] - sorted[i][0] + 1, sorted[i][1]});
                i++;
            }
            // intervals ending before q can't contain this or any later query
            while (!heap.isEmpty() && heap.peek()[1] < q) heap.poll();
            if (!heap.isEmpty()) answer[idx] = heap.peek()[0];
        }
        return answer;
    }
}
