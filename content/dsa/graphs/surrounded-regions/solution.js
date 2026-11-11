/**
 * @param {string[][]} board
 * @return {void} captures surrounded regions in place
 */
export default function solve(board) {
  const rows = board.length;
  const cols = board[0].length;
  // an 'O' connected to the border can't be surrounded: mark it safe ('S')
  const markSafe = (r, c) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== 'O') return;
    board[r][c] = 'S';
    markSafe(r + 1, c);
    markSafe(r - 1, c);
    markSafe(r, c + 1);
    markSafe(r, c - 1);
  };
  for (let r = 0; r < rows; r++) {
    markSafe(r, 0);
    markSafe(r, cols - 1);
  }
  for (let c = 0; c < cols; c++) {
    markSafe(0, c);
    markSafe(rows - 1, c);
  }
  // unmarked 'O's are enclosed, so capture them; safe cells go back to 'O'
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 'O') board[r][c] = 'X';
      else if (board[r][c] === 'S') board[r][c] = 'O';
    }
  }
}
