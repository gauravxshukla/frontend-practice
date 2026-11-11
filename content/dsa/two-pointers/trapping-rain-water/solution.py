class Solution:
    def trap(self, height: List[int]) -> int:
        l, r = 0, len(height) - 1
        lmax = rmax = res = 0
        while l < r:
            # the lower side is the bottleneck, so its water is known now
            if height[l] < height[r]:
                lmax = max(lmax, height[l])  # update max first
                res += lmax - height[l]  # water above this bar
                l += 1
            else:
                rmax = max(rmax, height[r])
                res += rmax - height[r]
                r -= 1
        # empty or single-bar input never enters the loop and traps 0
        return res
