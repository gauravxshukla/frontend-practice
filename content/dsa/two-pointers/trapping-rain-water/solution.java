class Solution {
    public int trap(int[] height) {
        int l = 0;
        int r = height.length - 1;
        int lmax = 0, rmax = 0, res = 0;
        while (l < r) {
            // the lower side is the bottleneck, so its water is known now
            if (height[l] < height[r]) {
                lmax = Math.max(lmax, height[l]); // update max first
                res += lmax - height[l]; // water above this bar
                l++;
            } else {
                rmax = Math.max(rmax, height[r]);
                res += rmax - height[r];
                r--;
            }
        }
        // empty or single-bar input never enters the loop and traps 0
        return res;
    }
}
