export default class WordDictionary {
  constructor() {
    this.root = { children: new Map(), isEnd: false };
  }

  /**
   * @param {string} word
   * @return {void}
   */
  addWord(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isEnd: false });
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  /**
   * @param {string} word may contain '.', which matches any single letter
   * @return {boolean}
   */
  search(word) {
    // DFS: a letter follows one edge, a '.' tries every child.
    const dfs = (node, i) => {
      if (i === word.length) return node.isEnd;
      const ch = word[i];
      if (ch === '.') {
        for (const child of node.children.values()) {
          if (dfs(child, i + 1)) return true;
        }
        return false;
      }
      const next = node.children.get(ch);
      return next ? dfs(next, i + 1) : false;
    };
    return dfs(this.root, 0);
  }
}
