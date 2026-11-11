class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // binary search the shorter array so the other side's index stays valid
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.length;
        int n = nums2.length;
        int half = (m + n + 1) / 2; // size of the left part (gets the extra item when odd)
        int l = 0;
        int r = m;
        while (l <= r) {
            int i = (l + r) / 2; // items taken from nums1 into the left part
            int j = half - i; // the rest of the left part comes from nums2
            // values beside the cut; missing sides act as -infinity / +infinity
            double left1 = i > 0 ? nums1[i - 1] : Double.NEGATIVE_INFINITY;
            double right1 = i < m ? nums1[i] : Double.POSITIVE_INFINITY;
            double left2 = j > 0 ? nums2[j - 1] : Double.NEGATIVE_INFINITY;
            double right2 = j < n ? nums2[j] : Double.POSITIVE_INFINITY;
            if (left1 <= right2 && left2 <= right1) {
                // every left value is <= every right value: the cut is the median position
                if ((m + n) % 2 == 1) return Math.max(left1, left2);
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
            }
            // nums1 gave too much to the left, so take fewer from it
            if (left1 > right2) r = i - 1;
            // nums1 gave too little, so take more
            else l = i + 1;
        }
        return 0; // unreachable for sorted input
    }
}
