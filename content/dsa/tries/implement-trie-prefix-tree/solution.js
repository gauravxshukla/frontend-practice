export default class Trie {
  constructor() {
    // Each node: { children: Map<char, node>, isEnd: boolean }
    this.root = { children: new Map(), isEnd: false };
  }

  /**
   * @param {string} word
   * @return {void}
   */
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isEnd: false });
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  // Walks the path for `s` and returns the last node, or null if the path breaks.
  walk(s) {
    let node = this.root;
    for (const ch of s) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  /**
   * @param {string} word
   * @return {boolean} true if this exact word was inserted
   */
  search(word) {
    const node = this.walk(word);
    return node !== null && node.isEnd;
  }

  /**
   * @param {string} prefix
   * @return {boolean} true if any inserted word starts with prefix
   */
  startsWith(prefix) {
    return this.walk(prefix) !== null;
  }
}
