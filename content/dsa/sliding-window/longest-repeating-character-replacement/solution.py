class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        counts = [0] * 26  # letter counts inside the window
        l = 0
        max_freq = 0  # highest single-letter count the window has reached
        best = 0
        for r in range(len(s)):
            # the new letter may become the one we keep, so update the max
            counts[ord(s[r]) - ord("A")] += 1
            max_freq = max(max_freq, counts[ord(s[r]) - ord("A")])
            # every other letter must be replaced; more than k means shrink
            while r - l + 1 - max_freq > k:
                counts[ord(s[l]) - ord("A")] -= 1
                l += 1
            best = max(best, r - l + 1)
        return best
