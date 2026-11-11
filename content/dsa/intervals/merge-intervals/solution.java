class Solution {
    public int[][] merge(int[][] intervals) {
        // sorted by start, an interval can only overlap the one merged just before it
        int[][] sorted = intervals.clone();
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> result = new ArrayList<>();
        for (int[] iv : sorted) {
            int[] last = result.isEmpty() ? null : result.get(result.size() - 1);
            // overlapping (or touching): extend; max because it may already reach further
            if (last != null && iv[0] <= last[1]) last[1] = Math.max(last[1], iv[1]);
            else result.add(new int[] {iv[0], iv[1]});
        }
        return result.toArray(new int[0][]);
    }
}
