class Solution {
    private int start, length;

    public String longestPalindrome(String s) {
        start = 0;
        length = 0;
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i); // odd length: centred on a letter
            expand(s, i, i + 1); // even length: centred between two letters
        }
        return s.substring(start, start + length);
    }

    // grow outward from a centre while both ends match
    private void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--;
            r++;
        }
        // the loop overshot by one on each side
        if (r - l - 1 > length) {
            start = l + 1;
            length = r - l - 1;
        }
    }
}
