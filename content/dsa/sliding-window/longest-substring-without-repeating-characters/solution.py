class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last = {}  # char -> last index it appeared at
        l = 0  # left edge of the current repeat-free window
        best = 0
        for r, ch in enumerate(s):
            # a repeat inside the window forces the left edge past its previous copy
            if ch in last and last[ch] >= l:
                l = last[ch] + 1
            last[ch] = r
            best = max(best, r - l + 1)
        return best
