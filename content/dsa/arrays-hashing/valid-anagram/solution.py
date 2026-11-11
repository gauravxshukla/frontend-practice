class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # different lengths can never use the same letters
        if len(s) != len(t):
            return False
        counts = [0] * 26  # one counter per letter a-z
        for i in range(len(s)):
            # s adds a letter, t takes one away; anagrams cancel out exactly
            counts[ord(s[i]) - ord("a")] += 1
            counts[ord(t[i]) - ord("a")] -= 1
        # any non-zero counter is a letter one string has more of
        return all(c == 0 for c in counts)
