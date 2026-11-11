class Solution {
    public boolean canJump(int[] nums) {
        int reach = 0; // farthest index we know we can land on
        for (int i = 0; i < nums.length; i++) {
            // i is beyond anything reachable, so the end is too
            if (i > reach) return false;
            reach = Math.max(reach, i + nums[i]);
        }
        return true;
    }
}
