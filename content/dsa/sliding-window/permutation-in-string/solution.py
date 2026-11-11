class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        # no window of s2 is long enough
        if len(s1) > len(s2):
            return False
        need = [0] * 26  # letter counts of s1
        have = [0] * 26  # letter counts of the current window
        for i in range(len(s1)):
            need[ord(s1[i]) - ord("a")] += 1
            have[ord(s2[i]) - ord("a")] += 1
        # how many of the 26 letters currently have equal counts
        matches = sum(1 for c in range(26) if need[c] == have[c])

        # only the entering and leaving letters can change a match
        def update(c: int, delta: int) -> None:
            nonlocal matches
            if have[c] == need[c]:
                matches -= 1
            have[c] += delta
            if have[c] == need[c]:
                matches += 1

        for r in range(len(s1), len(s2)):
            if matches == 26:
                return True
            update(ord(s2[r]) - ord("a"), 1)  # letter entering on the right
            update(ord(s2[r - len(s1)]) - ord("a"), -1)  # letter leaving on the left
        # the last window hasn't been checked inside the loop
        return matches == 26
