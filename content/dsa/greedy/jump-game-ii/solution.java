class Solution {
    public int jump(int[] nums) {
        int jumps = 0;
        int windowEnd = 0; // last index reachable with the current number of jumps
        int farthest = 0; // farthest index reachable with one more jump
        // the last index needs no jump out of it
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            // leaving the current window costs one jump, landing anywhere up to farthest
            if (i == windowEnd) {
                jumps++;
                windowEnd = farthest;
            }
        }
        return jumps;
    }
}
