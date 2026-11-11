class Solution {
    public int climbStairs(int n) {
        // ways to stand on the step two below and one below the current one
        int twoBack = 1; // step 0: one way (do nothing)
        int oneBack = 1; // step 1: one way
        for (int i = 2; i <= n; i++) {
            // the last move was either a 1-step or a 2-step
            int ways = oneBack + twoBack;
            twoBack = oneBack;
            oneBack = ways;
        }
        return oneBack;
    }
}
