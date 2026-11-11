class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        # hours needed at speed k: each pile takes ceil(pile / k) hours
        def hours_at(k: int) -> int:
            return sum((pile + k - 1) // k for pile in piles)

        # the answer is between 1 and the biggest pile (one pile per hour)
        l, r = 1, max(piles)
        while l < r:
            mid = l + (r - l) // 2
            # fast enough: mid works, but a slower speed might too
            if hours_at(mid) <= h:
                r = mid
            # too slow: every speed up to mid is too slow
            else:
                l = mid + 1
        return l
