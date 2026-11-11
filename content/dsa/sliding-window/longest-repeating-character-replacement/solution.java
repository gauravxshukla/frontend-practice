class Solution {
    public int characterReplacement(String s, int k) {
        int[] counts = new int[26]; // letter counts inside the window
        int l = 0;
        int maxFreq = 0; // highest single-letter count the window has reached
        int best = 0;
        for (int r = 0; r < s.length(); r++) {
            // the new letter may become the one we keep, so update the max
            maxFreq = Math.max(maxFreq, ++counts[s.charAt(r) - 'A']);
            // every other letter must be replaced; more than k means shrink
            while (r - l + 1 - maxFreq > k) {
                counts[s.charAt(l) - 'A']--;
                l++;
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
