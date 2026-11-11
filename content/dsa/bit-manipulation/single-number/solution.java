class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        // pairs cancel out (a ^ a = 0), leaving the value that appears once
        for (int n : nums) result ^= n;
        return result;
    }
}
