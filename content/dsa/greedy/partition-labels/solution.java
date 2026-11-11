class Solution {
    public int[] partitionLabels(String s) {
        // where each letter appears for the last time
        Map<Character, Integer> last = new HashMap<>();
        for (int i = 0; i < s.length(); i++) last.put(s.charAt(i), i);
        List<Integer> sizes = new ArrayList<>();
        int start = 0;
        int end = 0; // the current part must reach at least this far
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last.get(s.charAt(i)));
            // every letter seen in this part ends by i, so it can close here
            if (i == end) {
                sizes.add(end - start + 1);
                start = i + 1;
            }
        }
        int[] out = new int[sizes.size()];
        for (int i = 0; i < out.length; i++) out[i] = sizes.get(i);
        return out;
    }
}
