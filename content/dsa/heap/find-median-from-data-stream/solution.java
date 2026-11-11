class MedianFinder {
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder()); // max-heap: the smaller half
    private final PriorityQueue<Integer> high = new PriorityQueue<>(); // min-heap: the larger half

    public MedianFinder() {}

    public void addNum(int num) {
        // route through low so the biggest of the small half moves up into high
        low.offer(num);
        high.offer(low.poll());
        // keep low the same size as high, or one bigger
        if (high.size() > low.size()) low.offer(high.poll());
    }

    public double findMedian() {
        // odd count: the extra item is low's top
        if (low.size() > high.size()) return low.peek();
        return ((long) low.peek() + high.peek()) / 2.0;
    }
}
