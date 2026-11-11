class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        build("", 0, 0, n, result);
        return result;
    }

    private void build(String current, int open, int close, int n, List<String> result) {
        // every pair is placed, and the rules below kept it valid
        if (current.length() == 2 * n) {
            result.add(current);
            return;
        }
        // an opener is allowed while some are still unused
        if (open < n) build(current + "(", open + 1, close, n, result);
        // a closer is allowed only if it has an unmatched opener
        if (close < open) build(current + ")", open, close + 1, n, result);
    }
}
