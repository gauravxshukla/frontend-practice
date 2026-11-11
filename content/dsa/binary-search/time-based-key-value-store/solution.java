class TimeMap {
    // key -> (timestamp, value) pairs, in the order they were set (so sorted by time)
    private final Map<String, List<Integer>> times = new HashMap<>();
    private final Map<String, List<String>> values = new HashMap<>();

    public TimeMap() {}

    public void set(String key, String value, int timestamp) {
        // timestamps only increase, so appending keeps the list sorted
        times.computeIfAbsent(key, k -> new ArrayList<>()).add(timestamp);
        values.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
    }

    public String get(String key, int timestamp) {
        List<Integer> ts = times.getOrDefault(key, Collections.emptyList());
        String result = ""; // nothing set at or before timestamp yet
        int l = 0;
        int r = ts.size() - 1;
        // find the last entry whose time is <= timestamp
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (ts.get(mid) <= timestamp) {
                result = values.get(key).get(mid); // a candidate; a later one may also fit
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        return result;
    }
}
