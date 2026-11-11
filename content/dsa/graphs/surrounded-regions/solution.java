class Solution {
    private char[][] board;

    public void solve(char[][] board) {
        this.board = board;
        int rows = board.length;
        int cols = board[0].length;
        for (int r = 0; r < rows; r++) {
            markSafe(r, 0);
            markSafe(r, cols - 1);
        }
        for (int c = 0; c < cols; c++) {
            markSafe(0, c);
            markSafe(rows - 1, c);
        }
        // unmarked 'O's are enclosed, so capture them; safe cells go back to 'O'
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (board[r][c] == 'O') board[r][c] = 'X';
                else if (board[r][c] == 'S') board[r][c] = 'O';
            }
        }
    }

    // an 'O' connected to the border can't be surrounded: mark it safe ('S')
    private void markSafe(int r, int c) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != 'O') return;
        board[r][c] = 'S';
        markSafe(r + 1, c);
        markSafe(r - 1, c);
        markSafe(r, c + 1);
        markSafe(r, c - 1);
    }
}
