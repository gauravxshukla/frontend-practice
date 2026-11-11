class Solution {
    public boolean wordBreak(String s, String[] wordDict) {
        // ok[i]: the first i characters can be split into dictionary words
        boolean[] ok = new boolean[s.length() + 1];
        ok[0] = true; // the empty prefix needs no words
        for (int i = 1; i <= s.length(); i++) {
            for (String w : wordDict) {
                // w can be the last word of the prefix if the part before it already splits
                if (w.length() <= i && ok[i - w.length()] && s.startsWith(w, i - w.length())) {
                    ok[i] = true;
                    break;
                }
            }
        }
        return ok[s.length()];
    }
}
