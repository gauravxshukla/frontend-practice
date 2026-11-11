class Solution {
    public int countSubstrings(String s) {
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            total += countFrom(s, i, i); // odd lengths, including the single letter
            total += countFrom(s, i, i + 1); // even lengths
        }
        return total;
    }

    // palindromes centred at (l, r): each matching step outward is one more
    private int countFrom(String s, int l, int r) {
        int count = 0;
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            count++;
            l--;
            r++;
        }
        return count;
    }
}
