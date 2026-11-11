class Solution {
    public int coinChange(int[] coins, int amount) {
        // dp[a] = fewest coins that make amount a (amount + 1 = impossible so far)
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0; // zero coins make zero
        for (int a = 1; a <= amount; a++) {
            for (int c : coins) {
                // using coin c last leaves a - c, whose best answer is already known
                if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
