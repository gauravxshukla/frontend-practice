class WordDictionary {
    private static class Node {
        // children by character, plus whether a word ends here
        Map<Character, Node> children = new HashMap<>();
        boolean end;
    }

    private final Node root = new Node();

    public WordDictionary() {}

    public void addWord(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            node = node.children.computeIfAbsent(ch, c -> new Node());
        }
        node.end = true;
    }

    public boolean search(String word) {
        return match(word, 0, root);
    }

    // does word[i..] match some path starting at node?
    private boolean match(String word, int i, Node node) {
        // the pattern is used up: it matches only if a word ends here
        if (i == word.length()) return node.end;
        char ch = word.charAt(i);
        if (ch == '.') {
            // a wildcard may be any child, so try each one
            for (Node child : node.children.values()) {
                if (match(word, i + 1, child)) return true;
            }
            return false;
        }
        // a fixed letter has exactly one place to go
        Node child = node.children.get(ch);
        return child != null && match(word, i + 1, child);
    }
}
