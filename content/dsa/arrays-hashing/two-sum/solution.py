class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}  # value -> index of numbers visited so far
        for i, n in enumerate(nums):
            # if the partner was seen earlier, we have the pair
            if target - n in seen:
                return [seen[target - n], i]
            # store after checking so a number never pairs with itself
            seen[n] = i
        return []  # unreachable: exactly one answer is guaranteed
