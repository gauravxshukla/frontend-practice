class Solution {
    public String longestPalindrome(String s) {
        // Expand around every centre (odd and even lengths).
        int bestLo = 0, bestHi = 0;
        for (int i = 0; i < s.length(); i++) {
            for (int[] centre : new int[][] {{i, i}, {i, i + 1}}) {
                int lo = centre[0], hi = centre[1];
                while (lo >= 0 && hi < s.length() && s.charAt(lo) == s.charAt(hi)) {
                    lo--;
                    hi++;
                }
                if (hi - lo - 1 > bestHi - bestLo) {
                    bestLo = lo + 1;
                    bestHi = hi;
                }
            }
        }
        return s.substring(bestLo, bestHi);
    }
}
