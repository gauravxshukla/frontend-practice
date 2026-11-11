class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> values = new HashSet<>(); // O(1) lookups, and duplicates collapse
        for (int n : nums) values.add(n);
        int best = 0;
        for (int num : values) {
            // only a run's first value starts a walk, so each value is walked once
            if (values.contains(num - 1)) continue;
            int length = 1;
            // extend the run while the next value exists
            while (values.contains(num + length)) length++;
            best = Math.max(best, length);
        }
        // empty input never enters the loop, so the answer is 0
        return best;
    }
}
