class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()  # values visited so far
        for num in nums:
            # a second sighting is the duplicate, so stop early
            if num in seen:
                return True
            seen.add(num)
        # every value was new (also covers empty and single-element input)
        return False
