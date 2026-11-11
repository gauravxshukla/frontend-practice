export default class Trie {
  constructor() {
    // each node: children by character, plus whether a word ends here
    this.root = { children: new Map(), end: false };
  }

  /** @param {string} word */
  insert(word) {
    let node = this.root;
    // create the missing part of the path, sharing any existing prefix
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false });
      node = node.children.get(ch);
    }
    node.end = true;
  }

  // the node reached by following the string, or null if the path breaks
  walk(str) {
    let node = this.root;
    for (const ch of str) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  /**
   * @param {string} word
   * @return {boolean}
   */
  search(word) {
    // the path must exist and a word must end exactly there
    const node = this.walk(word);
    return node !== null && node.end;
  }

  /**
   * @param {string} prefix
   * @return {boolean}
   */
  startsWith(prefix) {
    // any inserted word continuing this path makes the prefix valid
    return this.walk(prefix) !== null;
  }
}
