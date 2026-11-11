class Solution {
    private char[][] board;
    private String word;

    public boolean exist(char[][] board, String word) {
        this.board = board;
        this.word = word;
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) {
                if (dfs(r, c, 0)) return true;
            }
        }
        return false;
    }

    // can word[i..] be traced starting at (r, c)?
    private boolean dfs(int r, int c, int i) {
        if (i == word.length()) return true;
        // off the board, wrong letter, or already on this path ('#')
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != word.charAt(i)) return false;
        char ch = board[r][c];
        board[r][c] = '#'; // mark: a cell can't be reused within one path
        boolean found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
        board[r][c] = ch; // restore for other paths
        return found;
    }
}
