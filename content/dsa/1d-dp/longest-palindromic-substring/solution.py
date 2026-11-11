class Solution:
    def longestPalindrome(self, s: str) -> str:
        # Expand around every centre (odd and even lengths).
        best = ""
        for i in range(len(s)):
            for lo, hi in ((i, i), (i, i + 1)):
                while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                    lo, hi = lo - 1, hi + 1
                if hi - lo - 1 > len(best):
                    best = s[lo + 1 : hi]
        return best
