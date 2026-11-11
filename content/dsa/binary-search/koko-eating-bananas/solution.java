class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        // the answer is between 1 and the biggest pile (one pile per hour)
        int l = 1;
        int r = 0;
        for (int pile : piles) r = Math.max(r, pile);
        while (l < r) {
            int mid = l + (r - l) / 2;
            // fast enough: mid works, but a slower speed might too
            if (hoursAt(piles, mid) <= h) r = mid;
            // too slow: every speed up to mid is too slow
            else l = mid + 1;
        }
        return l;
    }

    // hours needed at speed k: each pile takes ceil(pile / k) hours; long because the sum can pass 2^31
    private long hoursAt(int[] piles, int k) {
        long hours = 0;
        for (int pile : piles) hours += (pile + (long) k - 1) / k;
        return hours;
    }
}
