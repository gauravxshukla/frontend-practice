class Solution {
    public int minMeetingRooms(int[][] intervals) {
        // only the order of start and end times matters, not which meeting they belong to
        int n = intervals.length;
        int[] starts = new int[n];
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }
        Arrays.sort(starts);
        Arrays.sort(ends);
        int rooms = 0;
        int e = 0; // earliest end time not yet used to free a room
        for (int start : starts) {
            // a meeting has already finished: reuse its room
            if (start >= ends[e]) e++;
            // every room is still busy: open a new one
            else rooms++;
        }
        return rooms;
    }
}
