class Solution {
    public boolean canAttendMeetings(int[][] intervals) {
        // sorted by start, only neighbours can overlap
        int[][] sorted = intervals.clone();
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));
        for (int i = 1; i < sorted.length; i++) {
            // starting before the previous meeting ends is a clash (ending exactly then is fine)
            if (sorted[i][0] < sorted[i - 1][1]) return false;
        }
        return true;
    }
}
