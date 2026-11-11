class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if len(t) > len(s):
            return ""
        need = {}  # char -> how many the window still needs
        for ch in t:
            need[ch] = need.get(ch, 0) + 1
        missing = len(t)  # required characters not yet inside the window
        best_start, best_len = 0, float("inf")
        l = 0
        for r in range(len(s)):
            # taking a still-needed char brings the window closer to covering t
            if s[r] in need:
                if need[s[r]] > 0:
                    missing -= 1
                need[s[r]] -= 1
            # covered: shrink from the left as long as it stays covered
            while missing == 0:
                if r - l + 1 < best_len:
                    best_start, best_len = l, r - l + 1
                if s[l] in need:
                    need[s[l]] += 1
                    # dropping a char we had no spare of breaks the cover
                    if need[s[l]] > 0:
                        missing += 1
                l += 1
        return "" if best_len == float("inf") else s[best_start : best_start + best_len]
