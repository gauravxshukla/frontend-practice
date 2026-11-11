class Solution {
    public int search(int[] nums, int target) {
        int l = 0;
        int r = nums.length - 1;
        // l <= r: a one-element range can still hold the target
        while (l <= r) {
            int mid = l + (r - l) / 2; // avoids int overflow of (l + r)
            if (nums[mid] == target) return mid;
            // the target can only be on the side sorted order points to
            if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
}
