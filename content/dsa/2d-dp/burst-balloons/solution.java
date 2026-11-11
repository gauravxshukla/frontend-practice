class Solution {
    public int maxCoins(int[] nums) {
        // virtual balloons worth 1 on both ends act as the outer neighbours
        int n = nums.length + 2;
        int[] vals = new int[n];
        vals[0] = 1;
        vals[n - 1] = 1;
        for (int i = 0; i < nums.length; i++) vals[i + 1] = nums[i];
        // dp[l][r] = best coins from bursting every balloon strictly between l and r
        int[][] dp = new int[n][n];
        // solve shorter intervals first, since longer ones are built from them
        for (int width = 2; width < n; width++) {
            for (int l = 0; l + width < n; l++) {
                int r = l + width;
                // k is the last balloon burst between l and r, so its neighbours are l and r
                for (int k = l + 1; k < r; k++) {
                    dp[l][r] = Math.max(dp[l][r], dp[l][k] + vals[l] * vals[k] * vals[r] + dp[k][r]);
                }
            }
        }
        return dp[0][n - 1];
    }
}
