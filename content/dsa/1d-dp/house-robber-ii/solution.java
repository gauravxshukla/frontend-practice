class Solution {
    public int rob(int[] nums) {
        // with one house there is no neighbour conflict to split around
        if (nums.length == 1) return nums[0];
        // the first and last houses touch, so at least one of them is left out
        return Math.max(robLine(nums, 0, nums.length - 2), robLine(nums, 1, nums.length - 1));
    }

    // straight-line House Robber over nums[lo..hi]
    private int robLine(int[] nums, int lo, int hi) {
        int twoBack = 0;
        int oneBack = 0;
        for (int i = lo; i <= hi; i++) {
            int best = Math.max(oneBack, twoBack + nums[i]);
            twoBack = oneBack;
            oneBack = best;
        }
        return oneBack;
    }
}
