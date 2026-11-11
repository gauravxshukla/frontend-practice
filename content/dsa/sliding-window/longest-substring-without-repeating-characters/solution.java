class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> last = new HashMap<>(); // char -> last index it appeared at
        int l = 0; // left edge of the current repeat-free window
        int best = 0;
        for (int r = 0; r < s.length(); r++) {
            char ch = s.charAt(r);
            // a repeat inside the window forces the left edge past its previous copy
            if (last.containsKey(ch) && last.get(ch) >= l) l = last.get(ch) + 1;
            last.put(ch, r);
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
