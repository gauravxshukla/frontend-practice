class Solution {
    private static class Node {
        Map<Character, Node> children = new HashMap<>();
        String word; // the word that ends at this node, if any
    }

    private char[][] board;
    private final List<String> found = new ArrayList<>();
    private static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    public List<String> findWords(char[][] board, String[] words) {
        // one trie for all words; the end node remembers which word it completes
        Node root = new Node();
        for (String w : words) {
            Node node = root;
            for (char ch : w.toCharArray()) node = node.children.computeIfAbsent(ch, k -> new Node());
            node.word = w;
        }
        this.board = board;
        found.clear();
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[0].length; c++) dfs(r, c, root);
        }
        return found;
    }

    private void dfs(int r, int c, Node parent) {
        char ch = board[r][c];
        Node node = parent.children.get(ch);
        // no word continues with this letter (or the cell is already on the path)
        if (node == null) return;
        if (node.word != null) {
            found.add(node.word);
            node.word = null; // record each word only once
        }
        // mark the cell as used on the current path, explore, then restore it
        board[r][c] = '#';
        for (int[] d : DIRS) {
            int nr = r + d[0];
            int nc = c + d[1];
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) dfs(nr, nc, node);
        }
        board[r][c] = ch;
    }
}
