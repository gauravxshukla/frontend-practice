class DetectSquares {
    private final Map<String, Integer> counts = new HashMap<>(); // "x,y" -> how many times the point was added

    public DetectSquares() {}

    public void add(int[] point) {
        counts.merge(point[0] + "," + point[1], 1, Integer::sum);
    }

    public int count(int[] point) {
        int x = point[0];
        int y = point[1];
        int total = 0;
        for (Map.Entry<String, Integer> e : counts.entrySet()) {
            String[] parts = e.getKey().split(",");
            int px = Integer.parseInt(parts[0]);
            int py = Integer.parseInt(parts[1]);
            // a diagonal corner must differ by the same non-zero amount on both axes
            if (Math.abs(px - x) != Math.abs(py - y) || px == x) continue;
            // the other two corners are then fixed; duplicates multiply the ways
            total += e.getValue() * counts.getOrDefault(x + "," + py, 0) * counts.getOrDefault(px + "," + y, 0);
        }
        return total;
    }
}
