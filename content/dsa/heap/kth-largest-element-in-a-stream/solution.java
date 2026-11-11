class KthLargest {
    private final int k;
    // min-heap of the k largest values seen; its top is the k-th largest
    private final PriorityQueue<Integer> heap = new PriorityQueue<>();

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int n : nums) add(n);
    }

    public int add(int val) {
        heap.offer(val);
        // anything beyond the k largest can never be the answer again
        if (heap.size() > k) heap.poll();
        return heap.peek();
    }
}
