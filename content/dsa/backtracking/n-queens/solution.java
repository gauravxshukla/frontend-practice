class Solution {
    private final List<List<String>> result = new ArrayList<>();
    private int n;
    private int[] queenCol; // column of the queen in each row
    // columns and both diagonal directions already under attack
    private final Set<Integer> cols = new HashSet<>();
    private final Set<Integer> diag = new HashSet<>(); // r - c is constant along a "\" diagonal
    private final Set<Integer> anti = new HashSet<>(); // r + c is constant along a "/" diagonal

    public List<List<String>> solveNQueens(int n) {
        this.n = n;
        queenCol = new int[n];
        result.clear();
        dfs(0);
        return result;
    }

    private void dfs(int r) {
        // a queen in every row: turn the placement into board strings
        if (r == n) {
            List<String> board = new ArrayList<>();
            for (int c : queenCol) {
                char[] row = new char[n];
                Arrays.fill(row, '.');
                row[c] = 'Q';
                board.add(new String(row));
            }
            result.add(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols.contains(c) || diag.contains(r - c) || anti.contains(r + c)) continue;
            // place, explore the next row, then remove the queen
            queenCol[r] = c;
            cols.add(c);
            diag.add(r - c);
            anti.add(r + c);
            dfs(r + 1);
            cols.remove(c);
            diag.remove(r - c);
            anti.remove(r + c);
        }
    }
}
