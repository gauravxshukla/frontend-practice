class Solution {
    public String minWindow(String s, String t) {
        if (t.length() > s.length()) return "";
        Map<Character, Integer> need = new HashMap<>(); // char -> how many the window still needs
        for (char ch : t.toCharArray()) need.put(ch, need.getOrDefault(ch, 0) + 1);
        int missing = t.length(); // required characters not yet inside the window
        int bestStart = 0;
        int bestLen = Integer.MAX_VALUE;
        int l = 0;
        for (int r = 0; r < s.length(); r++) {
            char in = s.charAt(r);
            // taking a still-needed char brings the window closer to covering t
            if (need.containsKey(in)) {
                if (need.get(in) > 0) missing--;
                need.put(in, need.get(in) - 1);
            }
            // covered: shrink from the left as long as it stays covered
            while (missing == 0) {
                if (r - l + 1 < bestLen) {
                    bestStart = l;
                    bestLen = r - l + 1;
                }
                char out = s.charAt(l);
                if (need.containsKey(out)) {
                    need.put(out, need.get(out) + 1);
                    // dropping a char we had no spare of breaks the cover
                    if (need.get(out) > 0) missing++;
                }
                l++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}
