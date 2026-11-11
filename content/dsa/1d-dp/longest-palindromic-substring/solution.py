class Solution:
    def longestPalindrome(self, s: str) -> str:
        start, length = 0, 0

        # grow outward from a centre while both ends match
        def expand(l: int, r: int) -> None:
            nonlocal start, length
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1
                r += 1
            # the loop overshot by one on each side
            if r - l - 1 > length:
                start, length = l + 1, r - l - 1

        for i in range(len(s)):
            expand(i, i)  # odd length: centred on a letter
            expand(i, i + 1)  # even length: centred between two letters
        return s[start : start + length]
