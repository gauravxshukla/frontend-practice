class Solution {
    public int maxArea(int[] height) {
        int l = 0;
        int r = height.length - 1;
        int best = 0;
        while (l < r) {
            // the shorter line sets the water level across the full width
            best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
            // keeping the shorter line can't beat this area, so drop it
            if (height[l] < height[r]) l++;
            else r--;
        }
        return best;
    }
}
