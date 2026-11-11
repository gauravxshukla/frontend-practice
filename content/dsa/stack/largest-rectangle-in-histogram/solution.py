class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        stack = []  # indices with increasing heights
        best = 0
        # i == n acts as a height-0 bar that closes everything left on the stack
        for i in range(len(heights) + 1):
            h = 0 if i == len(heights) else heights[i]
            # a shorter bar is the right boundary for every taller bar on the stack
            while stack and heights[stack[-1]] > h:
                height = heights[stack.pop()]
                # the new top is the nearest shorter bar on the left
                left = stack[-1] if stack else -1
                best = max(best, height * (i - left - 1))
            stack.append(i)
        return best
