class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // how often each value appears
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.put(n, freq.getOrDefault(n, 0) + 1);

        // a count is between 1 and n, so index buckets by count (n + 1 slots)
        List<List<Integer>> buckets = new ArrayList<>();
        for (int i = 0; i <= nums.length; i++) buckets.add(new ArrayList<>());
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) buckets.get(e.getValue()).add(e.getKey());

        // the highest counts come first when scanning buckets from the top
        int[] result = new int[k];
        int taken = 0;
        for (int c = buckets.size() - 1; c > 0 && taken < k; c--) {
            for (int value : buckets.get(c)) {
                result[taken++] = value;
                if (taken == k) break;
            }
        }
        return result;
    }
}
