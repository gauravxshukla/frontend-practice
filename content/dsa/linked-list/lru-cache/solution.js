export default class LRUCache {
  /** @param {number} capacity */
  constructor(capacity) {
    this.capacity = capacity;
    this.nodes = new Map(); // key -> list node, for O(1) lookup
    // sentinels: head.next is the most recent entry, tail.prev the least recent
    this.head = { key: 0, value: 0, prev: null, next: null };
    this.tail = { key: 0, value: 0, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // unlink a node in O(1) using its own prev/next pointers
  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // the front of the list is the most recently used position
  addFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  /**
   * @param {number} key
   * @return {number}
   */
  get(key) {
    const node = this.nodes.get(key);
    if (!node) return -1;
    // reading counts as a use, so move it to the front
    this.remove(node);
    this.addFront(node);
    return node.value;
  }

  /**
   * @param {number} key
   * @param {number} value
   */
  put(key, value) {
    // an existing key is replaced, not duplicated
    if (this.nodes.has(key)) this.remove(this.nodes.get(key));
    const node = { key, value, prev: null, next: null };
    this.nodes.set(key, node);
    this.addFront(node);
    // over capacity: the node before the tail is the least recently used
    if (this.nodes.size > this.capacity) {
      const lru = this.tail.prev;
      this.remove(lru);
      this.nodes.delete(lru.key);
    }
  }
}
