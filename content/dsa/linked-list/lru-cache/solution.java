class LRUCache {
    private static class Node {
        int key, value;
        Node prev, next;

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<Integer, Node> nodes = new HashMap<>(); // key -> list node, for O(1) lookup
    // sentinels: head.next is the most recent entry, tail.prev the least recent
    private final Node head = new Node(0, 0);
    private final Node tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    // unlink a node in O(1) using its own prev/next pointers
    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    // the front of the list is the most recently used position
    private void addFront(Node node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    public int get(int key) {
        Node node = nodes.get(key);
        if (node == null) return -1;
        // reading counts as a use, so move it to the front
        remove(node);
        addFront(node);
        return node.value;
    }

    public void put(int key, int value) {
        // an existing key is replaced, not duplicated
        if (nodes.containsKey(key)) remove(nodes.get(key));
        Node node = new Node(key, value);
        nodes.put(key, node);
        addFront(node);
        // over capacity: the node before the tail is the least recently used
        if (nodes.size() > capacity) {
            Node lru = tail.prev;
            remove(lru);
            nodes.remove(lru.key);
        }
    }
}
