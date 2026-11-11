class Solution {
    public boolean isValidSudoku(char[][] board) {
        // one set of seen digits per row, per column and per 3x3 box
        List<Set<Character>> rows = new ArrayList<>();
        List<Set<Character>> cols = new ArrayList<>();
        List<Set<Character>> boxes = new ArrayList<>();
        for (int i = 0; i < 9; i++) {
            rows.add(new HashSet<>());
            cols.add(new HashSet<>());
            boxes.add(new HashSet<>());
        }

        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                char d = board[r][c];
                // empty cells can't break a rule
                if (d == '.') continue;
                // boxes are numbered 0-8, left to right then top to bottom
                int b = (r / 3) * 3 + c / 3;
                // a digit seen before in any of its three units is a repeat
                if (rows.get(r).contains(d) || cols.get(c).contains(d) || boxes.get(b).contains(d)) return false;
                rows.get(r).add(d);
                cols.get(c).add(d);
                boxes.get(b).add(d);
            }
        }
        return true;
    }
}
