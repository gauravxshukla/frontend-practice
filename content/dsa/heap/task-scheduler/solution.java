class Solution {
    public int leastInterval(String[] tasks, int n) {
        int[] counts = new int[26];
        for (String t : tasks) counts[t.charAt(0) - 'A']++;
        int maxCount = 0;
        for (int c : counts) maxCount = Math.max(maxCount, c);
        // tasks tied for the highest count all sit in the final row
        int withMax = 0;
        for (int c : counts) if (c == maxCount) withMax++;
        // (maxCount - 1) full frames of n + 1 slots, then one last row of the busiest tasks
        int framed = (maxCount - 1) * (n + 1) + withMax;
        // if other tasks overflow the gaps, no idling is needed at all
        return Math.max(tasks.length, framed);
    }
}
