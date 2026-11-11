/**
 * @param {string[][]} board
 * @param {string} word
 * @return {boolean}
 */
export default function exist(board, word) {
  const rows = board.length;
  const cols = board[0].length;
  // can word[i..] be traced starting at (r, c)?
  const dfs = (r, c, i) => {
    if (i === word.length) return true;
    // off the board, wrong letter, or already on this path ('#')
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[i]) return false;
    const ch = board[r][c];
    board[r][c] = '#'; // mark: a cell can't be reused within one path
    const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = ch; // restore for other paths
    return found;
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}
