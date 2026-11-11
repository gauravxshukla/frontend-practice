/**
 * @param {string[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
export default function findWords(board, words) {
  // one trie for all words; the end node remembers which word it completes
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
    // no word continues with this letter (or the cell is already on the path)
    if (!node) return;
    if (node.word !== null) {
      found.push(node.word);
      node.word = null; // record each word only once
    }
    // mark the cell as used on the current path, explore, then restore it
    board[r][c] = '#';
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) dfs(nr, nc, node);
    }
    board[r][c] = ch;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) dfs(r, c, root);
  }
  return found;
}
