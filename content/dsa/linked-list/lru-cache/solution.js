// Hash map + doubly linked list. The list runs from least recent (after head)
// to most recent (before tail); the map gives O(1) access to any node.
export default class LRUCache {
  /** @param {number} capacity */
  constructor(capacity) {
    this.capacity = capacity;
    this.nodes = new Map();
    this.head = { key: null, value: null, prev: null, next: null }; // sentinel
    this.tail = { key: null, value: null, prev: null, next: null }; // sentinel
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  unlink(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  pushBack(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  /**
   * @param {number} key
   * @return {number} the value, or -1 if the key is absent
   */
  get(key) {
    const node = this.nodes.get(key);
    if (!node) return -1;
    this.unlink(node);
    this.pushBack(node); // now the most recently used
    return node.value;
  }

  /**
   * @param {number} key
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    const existing = this.nodes.get(key);
    if (existing) {
      existing.value = value;
      this.unlink(existing);
      this.pushBack(existing);
      return;
    }
    if (this.nodes.size === this.capacity) {
      const lru = this.head.next;
      this.unlink(lru);
      this.nodes.delete(lru.key);
    }
    const node = { key, value, prev: null, next: null };
    this.pushBack(node);
    this.nodes.set(key, node);
  }
}
