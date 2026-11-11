class Solution:
    def findMin(self, nums: List[int]) -> int:
        l, r = 0, len(nums) - 1
        while l < r:
            mid = l + (r - l) // 2
            # mid is bigger than the right end, so the drop to the minimum is after mid
            if nums[mid] > nums[r]:
                l = mid + 1
            # mid..r is sorted, so the minimum is mid or to its left
            else:
                r = mid
        # l and r meet on the minimum
        return nums[l]
