class Solution {
    public int rob(int[] nums) {
        int twoBack = 0; // best total up to the house before the previous one
        int oneBack = 0; // best total up to the previous house
        for (int house : nums) {
            // skip this house (keep oneBack) or rob it on top of twoBack
            int best = Math.max(oneBack, twoBack + house);
            twoBack = oneBack;
            oneBack = best;
        }
        return oneBack;
    }
}
