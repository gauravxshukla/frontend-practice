export default class WordDictionary {
  constructor() {
    // each node: children by character, plus whether a word ends here
    this.root = { children: new Map(), end: false };
  }

  /** @param {string} word */
  addWord(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false });
      node = node.children.get(ch);
    }
    node.end = true;
  }

  /**
   * @param {string} word may contain '.' matching any letter
   * @return {boolean}
   */
  search(word) {
    // does word[i..] match some path starting at node?
    const match = (i, node) => {
      // the pattern is used up: it matches only if a word ends here
      if (i === word.length) return node.end;
      const ch = word[i];
      if (ch === '.') {
        // a wildcard may be any child, so try each one
        for (const child of node.children.values()) {
          if (match(i + 1, child)) return true;
        }
        return false;
      }
      // a fixed letter has exactly one place to go
      const child = node.children.get(ch);
      return child !== undefined && match(i + 1, child);
    };
    return match(0, this.root);
  }
}
