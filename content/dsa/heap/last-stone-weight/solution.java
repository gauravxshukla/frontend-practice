class Solution {
    public int lastStoneWeight(int[] stones) {
        // max-heap: the heaviest stones come out first
        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
        for (int s : stones) heap.offer(s);
        while (heap.size() > 1) {
            int y = heap.poll(); // heaviest
            int x = heap.poll(); // second heaviest
            // equal stones both vanish; otherwise the difference survives
            if (y != x) heap.offer(y - x);
        }
        // every stone may have been destroyed
        return heap.isEmpty() ? 0 : heap.peek();
    }
}
