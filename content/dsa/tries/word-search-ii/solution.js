/**
 * @param {string[][]} board grid of lowercase letters
 * @param {string[]} words distinct words to look for
 * @return {string[]} the words that can be traced on the board, in any order
 */
export default function findWords(board, words) {
  // Build a trie of all words. A node's `word` is set where a word ends.
  const root = { children: new Map(), word: null };
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), word: null });
      node = node.children.get(ch);
    }
    node.word = w;
  }

  const rows = board.length;
  const cols = board[0].length;
  const found = [];

  const dfs = (r, c, parent) => {
    const ch = board[r][c];
    const node = parent.children.get(ch);
    if (!node) return;

    if (node.word !== null) {
      found.push(node.word);
      node.word = null; // report each word once
    }

    board[r][c] = '#'; // mark visited
    if (r > 0) dfs(r - 1, c, node);
    if (r < rows - 1) dfs(r + 1, c, node);
    if (c > 0) dfs(r, c - 1, node);
    if (c < cols - 1) dfs(r, c + 1, node);
    board[r][c] = ch;

    // Prune: a leaf with no word left can never match again.
    if (node.children.size === 0 && node.word === null) parent.children.delete(ch);
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) dfs(r, c, root);
  }
  return found;
}
