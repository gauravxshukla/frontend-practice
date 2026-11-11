class Solution {
    public int minCostClimbingStairs(int[] cost) {
        // cheapest cost to stand on step i - 2 and step i - 1; starting on 0 or 1 is free
        int twoBack = 0;
        int oneBack = 0;
        // the top is step cost.length, just past the last stair
        for (int i = 2; i <= cost.length; i++) {
            // arrive from one below (paying its cost) or two below (paying that one)
            int here = Math.min(oneBack + cost[i - 1], twoBack + cost[i - 2]);
            twoBack = oneBack;
            oneBack = here;
        }
        return oneBack;
    }
}
