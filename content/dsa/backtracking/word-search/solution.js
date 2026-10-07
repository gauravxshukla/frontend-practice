/**
 * @param {string[][]} board
 * @param {string} word
 * @return {boolean}
 */
export default function exist(board, word) {
  const rows = board.length;
  const cols = board[0].length;
  if (word.length > rows * cols) return false;

  // Prune: the board must contain enough of every letter.
  const counts = new Map();
  for (const row of board) for (const ch of row) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  const need = new Map();
  for (const ch of word) need.set(ch, (need.get(ch) ?? 0) + 1);
  for (const [ch, n] of need) if ((counts.get(ch) ?? 0) < n) return false;

  // Start from the rarer end of the word to cut the search early.
  const target =
    (counts.get(word[0]) ?? 0) > (counts.get(word[word.length - 1]) ?? 0)
      ? [...word].reverse().join('')
      : word;

  function dfs(r, c, i) {
    if (i === target.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== target[i]) return false;
    const saved = board[r][c];
    board[r][c] = '#'; // mark as used on this path
    const found =
      dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = saved; // un-mark when backtracking
    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}
