class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # binary search the shorter array so the other side's index stays valid
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        half = (m + n + 1) // 2  # size of the left part (gets the extra item when odd)
        l, r = 0, m
        while l <= r:
            i = (l + r) // 2  # items taken from nums1 into the left part
            j = half - i  # the rest of the left part comes from nums2
            # values beside the cut; missing sides act as -inf / +inf
            left1 = nums1[i - 1] if i > 0 else float("-inf")
            right1 = nums1[i] if i < m else float("inf")
            left2 = nums2[j - 1] if j > 0 else float("-inf")
            right2 = nums2[j] if j < n else float("inf")
            if left1 <= right2 and left2 <= right1:
                # every left value is <= every right value: the cut is the median position
                if (m + n) % 2 == 1:
                    return float(max(left1, left2))
                return (max(left1, left2) + min(right1, right2)) / 2
            # nums1 gave too much to the left, so take fewer from it
            if left1 > right2:
                r = i - 1
            # nums1 gave too little, so take more
            else:
                l = i + 1
        return 0.0  # unreachable for sorted input
