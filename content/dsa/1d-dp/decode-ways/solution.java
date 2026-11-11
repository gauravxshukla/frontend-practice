class Solution {
    public int numDecodings(String s) {
        // ways to decode the first i - 2 and i - 1 digits
        int twoBack = 1; // empty prefix: one way (decode nothing)
        int oneBack = s.charAt(0) == '0' ? 0 : 1; // a leading zero can't be decoded
        for (int i = 2; i <= s.length(); i++) {
            int ways = 0;
            // last digit on its own: any digit except 0
            if (s.charAt(i - 1) != '0') ways += oneBack;
            // last two digits together: 10..26 (a leading 0 like "06" isn't allowed)
            int pair = Integer.parseInt(s.substring(i - 2, i));
            if (pair >= 10 && pair <= 26) ways += twoBack;
            twoBack = oneBack;
            oneBack = ways;
        }
        return oneBack;
    }
}
