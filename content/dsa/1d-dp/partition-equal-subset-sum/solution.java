class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int n : nums) total += n;
        // an odd total can't be split into two equal integer halves
        if (total % 2 != 0) return false;
        int target = total / 2;
        // can[s]: some subset of the numbers seen so far sums to s
        boolean[] can = new boolean[target + 1];
        can[0] = true;
        for (int num : nums) {
            // go downward so this num is used at most once per pass
            for (int s = target; s >= num; s--) {
                if (can[s - num]) can[s] = true;
            }
        }
        return can[target];
    }
}
