class Solution {
    public int maxSubArray(int[] nums) {
        int current = nums[0]; // best sum of a subarray ending at the current index
        int best = nums[0]; // all-negative input still needs a real element
        for (int i = 1; i < nums.length; i++) {
            // a negative running sum can only hurt, so restart at nums[i] instead
            current = Math.max(nums[i], current + nums[i]);
            best = Math.max(best, current);
        }
        return best;
    }
}
