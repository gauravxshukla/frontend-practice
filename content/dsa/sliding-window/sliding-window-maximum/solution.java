class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> dq = new ArrayDeque<>(); // indices whose values decrease from front to back
        int[] result = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            // smaller values behind a bigger newcomer can never be a window max again
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.offerLast(i);
            // the front index slid out of the window
            if (dq.peekFirst() <= i - k) dq.pollFirst();
            // once the first full window exists, the front holds its max
            if (i >= k - 1) result[i - k + 1] = nums[dq.peekFirst()];
        }
        return result;
    }
}
