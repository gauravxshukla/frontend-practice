class Solution {
    private final Map<Node, Node> copies = new HashMap<>(); // original node -> its clone

    public Node cloneGraph(Node node) {
        copies.clear();
        return node == null ? null : clone(node);
    }

    private Node clone(Node original) {
        // already cloned (we came back around a cycle): reuse it
        if (copies.containsKey(original)) return copies.get(original);
        Node copy = new Node(original.val);
        // register before visiting neighbours so cycles find this clone
        copies.put(original, copy);
        for (Node nb : original.neighbors) copy.neighbors.add(clone(nb));
        return copy;
    }
}
