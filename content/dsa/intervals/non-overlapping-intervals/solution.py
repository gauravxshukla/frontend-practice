class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        removed = 0
        last_end = float("-inf")  # end of the last interval kept
        # the interval ending first leaves the most room for everything after it
        for start, end in sorted(intervals, key=lambda iv: iv[1]):
            # starts at or after the last kept end: keep it (touching is fine)
            if start >= last_end:
                last_end = end
            # overlaps a kept interval that ends sooner, so this one goes
            else:
                removed += 1
        return removed
