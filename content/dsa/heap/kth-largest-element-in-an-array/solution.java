class Solution {
    public int findKthLargest(int[] nums, int k) {
        // min-heap of the k largest values seen so far
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int n : nums) {
            heap.offer(n);
            // the smallest of k + 1 values can't be among the k largest
            if (heap.size() > k) heap.poll();
        }
        // the smallest of the k largest is the k-th largest
        return heap.peek();
    }
}
