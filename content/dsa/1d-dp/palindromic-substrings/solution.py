class Solution:
    def countSubstrings(self, s: str) -> int:
        # palindromes centred at (l, r): each matching step outward is one more
        def count_from(l: int, r: int) -> int:
            count = 0
            while l >= 0 and r < len(s) and s[l] == s[r]:
                count += 1
                l -= 1
                r += 1
            return count

        total = 0
        for i in range(len(s)):
            total += count_from(i, i)  # odd lengths, including the single letter
            total += count_from(i, i + 1)  # even lengths
        return total
