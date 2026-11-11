class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        # l <= r: a one-element range can still hold the target
        while l <= r:
            mid = l + (r - l) // 2
            if nums[mid] == target:
                return mid
            # the target can only be on the side sorted order points to
            if nums[mid] < target:
                l = mid + 1
            else:
                r = mid - 1
        return -1
