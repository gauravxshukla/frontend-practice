class Solution {
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        Map<Node, Node> copies = new HashMap<>();
        copies.put(node, new Node(node.val));
        Deque<Node> queue = new ArrayDeque<>();
        queue.add(node);
        while (!queue.isEmpty()) {
            Node cur = queue.poll();
            for (Node nb : cur.neighbors) {
                if (!copies.containsKey(nb)) {
                    copies.put(nb, new Node(nb.val));
                    queue.add(nb);
                }
                copies.get(cur).neighbors.add(copies.get(nb));
            }
        }
        return copies.get(node);
    }
}
