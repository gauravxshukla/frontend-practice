class Solution {
    private int[] need = new int[26]; // letter counts of s1
    private int[] have = new int[26]; // letter counts of the current window
    private int matches; // how many of the 26 letters currently have equal counts

    public boolean checkInclusion(String s1, String s2) {
        // no window of s2 is long enough
        if (s1.length() > s2.length()) return false;
        need = new int[26];
        have = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            need[s1.charAt(i) - 'a']++;
            have[s2.charAt(i) - 'a']++;
        }
        matches = 0;
        for (int c = 0; c < 26; c++) if (need[c] == have[c]) matches++;

        for (int r = s1.length(); r < s2.length(); r++) {
            if (matches == 26) return true;
            update(s2.charAt(r) - 'a', 1); // letter entering on the right
            update(s2.charAt(r - s1.length()) - 'a', -1); // letter leaving on the left
        }
        // the last window hasn't been checked inside the loop
        return matches == 26;
    }

    // only the entering and leaving letters can change a match
    private void update(int c, int delta) {
        if (have[c] == need[c]) matches--;
        have[c] += delta;
        if (have[c] == need[c]) matches++;
    }
}
