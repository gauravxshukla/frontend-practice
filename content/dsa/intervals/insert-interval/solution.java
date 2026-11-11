class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int start = newInterval[0];
        int end = newInterval[1];
        int i = 0;
        // 1. intervals that end before the new one starts are untouched
        while (i < intervals.length && intervals[i][1] < start) result.add(intervals[i++]);
        // 2. every interval overlapping (or touching) the new one merges into it
        while (i < intervals.length && intervals[i][0] <= end) {
            start = Math.min(start, intervals[i][0]);
            end = Math.max(end, intervals[i][1]);
            i++;
        }
        result.add(new int[] {start, end});
        // 3. the rest start after the merged interval ends
        while (i < intervals.length) result.add(intervals[i++]);
        return result.toArray(new int[0][]);
    }
}
