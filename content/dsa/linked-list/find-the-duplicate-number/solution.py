class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        # reading i -> nums[i] as "next" makes a list; the duplicate is where the cycle starts
        slow = fast = 0
        # phase 1: find any meeting point inside the cycle
        while True:
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        # phase 2: from the start and the meeting point, equal steps meet at the cycle entrance
        finder = 0
        while finder != slow:
            finder = nums[finder]
            slow = nums[slow]
        return finder
