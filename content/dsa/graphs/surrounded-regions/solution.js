/**
 * Captures every "O" region that doesn't touch the border, in place.
 * @param {string[][]} board  cells are "X" or "O"
 * @return {void}
 */
export default function solve(board) {
  const rows = board.length;
  const cols = rows ? board[0].length : 0;

  // 1. Mark every "O" connected to the border as safe ("S").
  const stack = [];
  const markSafe = (r, c) => {
    if (board[r][c] === 'O') {
      board[r][c] = 'S';
      stack.push([r, c]);
    }
  };
  for (let r = 0; r < rows; r++) {
    markSafe(r, 0);
    markSafe(r, cols - 1);
  }
  for (let c = 0; c < cols; c++) {
    markSafe(0, c);
    markSafe(rows - 1, c);
  }
  while (stack.length) {
    const [r, c] = stack.pop();
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < rows && nc < cols) markSafe(nr, nc);
    }
  }

  // 2. Remaining "O"s are surrounded: flip them. Restore the safe ones.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 'O') board[r][c] = 'X';
      else if (board[r][c] === 'S') board[r][c] = 'O';
    }
  }
}
