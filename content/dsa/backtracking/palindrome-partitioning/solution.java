class Solution {
    private final List<List<String>> result = new ArrayList<>();
    private final List<String> path = new ArrayList<>();
    private String s;

    public List<List<String>> partition(String s) {
        this.s = s;
        result.clear();
        dfs(0);
        return result;
    }

    private void dfs(int start) {
        // the whole string is cut into palindromes
        if (start == s.length()) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int end = start; end < s.length(); end++) {
            // only a palindromic piece can be cut off, which prunes everything else early
            if (!isPalindrome(start, end)) continue;
            path.add(s.substring(start, end + 1));
            dfs(end + 1);
            path.remove(path.size() - 1);
        }
    }

    // two pointers moving inward check s[l..r]
    private boolean isPalindrome(int l, int r) {
        while (l < r) {
            if (s.charAt(l++) != s.charAt(r--)) return false;
        }
        return true;
    }
}
