class Solution {
    public Node copyRandomList(Node head) {
        // original -> copy; null maps to null so missing pointers copy as null
        Map<Node, Node> copyOf = new HashMap<>();
        copyOf.put(null, null);
        // pass 1: make every copy first, so any random target already exists
        for (Node node = head; node != null; node = node.next) copyOf.put(node, new Node(node.val));
        // pass 2: wire each copy to the copies of its original's neighbours
        for (Node node = head; node != null; node = node.next) {
            copyOf.get(node).next = copyOf.get(node.next);
            copyOf.get(node).random = copyOf.get(node.random);
        }
        return copyOf.get(head);
    }
}
