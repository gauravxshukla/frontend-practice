class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int total = 0;
        for (int n : nums) total += n;
        // the + group must sum to (total + target) / 2, which has to be a whole, reachable number
        if (Math.abs(target) > total || (total + target) % 2 != 0) return 0;
        int goal = (total + target) / 2;
        // ways[s] = subsets of the numbers so far that sum to s
        int[] ways = new int[goal + 1];
        ways[0] = 1;
        for (int num : nums) {
            // downward so each number joins a subset at most once (a 0 doubles the count: +0 and -0)
            for (int s = goal; s >= num; s--) ways[s] += ways[s - num];
        }
        return ways[goal];
    }
}
