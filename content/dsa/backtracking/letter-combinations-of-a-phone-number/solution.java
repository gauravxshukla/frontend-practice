class Solution {
    private static final String[] LETTERS = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    private final List<String> result = new ArrayList<>();
    private String digits;

    public List<String> letterCombinations(String digits) {
        result.clear();
        // no digits means no combinations at all (not one empty string)
        if (digits.isEmpty()) return result;
        this.digits = digits;
        dfs(0, "");
        return result;
    }

    private void dfs(int i, String path) {
        // one letter chosen for every digit
        if (i == digits.length()) {
            result.add(path);
            return;
        }
        // each letter on this digit's key starts its own branch
        for (char ch : LETTERS[digits.charAt(i) - '0'].toCharArray()) dfs(i + 1, path + ch);
    }
}
