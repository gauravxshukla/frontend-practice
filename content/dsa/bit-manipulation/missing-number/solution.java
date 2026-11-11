class Solution {
    public int missingNumber(int[] nums) {
        // indices only reach n - 1, so start with n itself
        int result = nums.length;
        for (int i = 0; i < nums.length; i++) {
            // each present value cancels with the matching index, leaving the missing one
            result ^= i ^ nums[i];
        }
        return result;
    }
}
