class _Node:
    def __init__(self, key: int = 0, value: int = 0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.nodes = {}  # key -> list node, for O(1) lookup
        # sentinels: head.next is the most recent entry, tail.prev the least recent
        self.head, self.tail = _Node(), _Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    # unlink a node in O(1) using its own prev/next pointers
    def _remove(self, node: _Node) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev

    # the front of the list is the most recently used position
    def _add_front(self, node: _Node) -> None:
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        node = self.nodes.get(key)
        if not node:
            return -1
        # reading counts as a use, so move it to the front
        self._remove(node)
        self._add_front(node)
        return node.value

    def put(self, key: int, value: int) -> None:
        # an existing key is replaced, not duplicated
        if key in self.nodes:
            self._remove(self.nodes[key])
        node = _Node(key, value)
        self.nodes[key] = node
        self._add_front(node)
        # over capacity: the node before the tail is the least recently used
        if len(self.nodes) > self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.nodes[lru.key]
