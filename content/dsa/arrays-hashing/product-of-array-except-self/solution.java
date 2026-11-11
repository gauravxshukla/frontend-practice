class Solution {
    public long[] productExceptSelf(int[] nums) {
        int n = nums.length;
        // long: this app's cases include products beyond the int range
        long[] answer = new long[n];
        // pass 1: answer[i] = product of everything to the left of i
        long left = 1;
        for (int i = 0; i < n; i++) {
            answer[i] = left;
            left *= nums[i];
        }
        // pass 2: multiply in the product of everything to the right of i
        long right = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= right;
            right *= nums[i];
        }
        // the output array is the only extra memory, and no division handles zeros
        return answer;
    }
}
