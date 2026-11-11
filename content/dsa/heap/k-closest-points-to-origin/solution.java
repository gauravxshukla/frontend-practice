class Solution {
    public List<List<Integer>> kClosest(int[][] points, int k) {
        // max-heap by squared distance (no square root needed for ordering)
        PriorityQueue<int[]> heap = new PriorityQueue<>(
            (a, b) -> Integer.compare(b[0] * b[0] + b[1] * b[1], a[0] * a[0] + a[1] * a[1]));
        for (int[] p : points) {
            heap.offer(p);
            // more than k kept: the farthest can't be among the k closest
            if (heap.size() > k) heap.poll();
        }
        List<List<Integer>> result = new ArrayList<>();
        for (int[] p : heap) result.add(Arrays.asList(p[0], p[1]));
        return result;
    }
}
