class Solution {
    public boolean isAnagram(String s, String t) {
        // different lengths can never use the same letters
        if (s.length() != t.length()) return false;
        int[] counts = new int[26]; // one counter per letter a-z
        for (int i = 0; i < s.length(); i++) {
            // s adds a letter, t takes one away; anagrams cancel out exactly
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }
        // any non-zero counter is a letter one string has more of
        for (int c : counts) {
            if (c != 0) return false;
        }
        return true;
    }
}
