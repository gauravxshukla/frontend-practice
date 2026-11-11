class Solution {
    public int lengthOfLIS(int[] nums) {
        // tails[k] = smallest tail value of any increasing subsequence of length k + 1 (kept sorted)
        int[] tails = new int[nums.length];
        int size = 0;
        for (int num : nums) {
            // find the first tail >= num (>= keeps the subsequence strictly increasing)
            int lo = 0;
            int hi = size;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (tails[mid] < num) lo = mid + 1;
                else hi = mid;
            }
            // a smaller tail for that length leaves more room to extend later; past the end, it's a new length
            tails[lo] = num;
            if (lo == size) size++;
        }
        return size;
    }
}
