class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        l, r = 0, len(numbers) - 1
        while l < r:
            total = numbers[l] + numbers[r]
            # found it; the problem wants 1-indexed positions
            if total == target:
                return [l + 1, r + 1]
            # too small: only a bigger left value can raise the sum
            if total < target:
                l += 1
            # too big: only a smaller right value can lower it
            else:
                r -= 1
        return []  # unreachable: exactly one answer is guaranteed
