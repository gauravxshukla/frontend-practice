class Solution {
    public int maxProduct(int[] nums) {
        // largest and smallest products of a subarray ending at the current index
        int curMax = nums[0];
        int curMin = nums[0];
        int best = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int n = nums[i];
            // start fresh at n, or extend either extreme (a negative n swaps them)
            int a = n * curMax;
            int b = n * curMin;
            curMax = Math.max(n, Math.max(a, b));
            curMin = Math.min(n, Math.min(a, b));
            best = Math.max(best, curMax);
        }
        return best;
    }
}
