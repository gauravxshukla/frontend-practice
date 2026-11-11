class Trie {
    private static class Node {
        // children by character, plus whether a word ends here
        Map<Character, Node> children = new HashMap<>();
        boolean end;
    }

    private final Node root = new Node();

    public Trie() {}

    public void insert(String word) {
        Node node = root;
        // create the missing part of the path, sharing any existing prefix
        for (char ch : word.toCharArray()) {
            node = node.children.computeIfAbsent(ch, c -> new Node());
        }
        node.end = true;
    }

    // the node reached by following the string, or null if the path breaks
    private Node walk(String s) {
        Node node = root;
        for (char ch : s.toCharArray()) {
            node = node.children.get(ch);
            if (node == null) return null;
        }
        return node;
    }

    public boolean search(String word) {
        // the path must exist and a word must end exactly there
        Node node = walk(word);
        return node != null && node.end;
    }

    public boolean startsWith(String prefix) {
        // any inserted word continuing this path makes the prefix valid
        return walk(prefix) != null;
    }
}
