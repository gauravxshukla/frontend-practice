class Solution:
    def maxArea(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        best = 0
        while l < r:
            # the shorter line sets the water level across the full width
            best = max(best, min(height[l], height[r]) * (r - l))
            # keeping the shorter line can't beat this area, so drop it
            if height[l] < height[r]:
                l += 1
            else:
                r -= 1
        return best
