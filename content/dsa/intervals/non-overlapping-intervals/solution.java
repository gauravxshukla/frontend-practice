class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        // the interval ending first leaves the most room for everything after it
        int[][] sorted = intervals.clone();
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[1], b[1]));
        int removed = 0;
        long lastEnd = Long.MIN_VALUE; // end of the last interval kept
        for (int[] iv : sorted) {
            // starts at or after the last kept end: keep it (touching is fine)
            if (iv[0] >= lastEnd) lastEnd = iv[1];
            // overlaps a kept interval that ends sooner, so this one goes
            else removed++;
        }
        return removed;
    }
}
