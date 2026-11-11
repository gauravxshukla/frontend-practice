/**
 * @param {string[][]} board 9x9 grid of '1'-'9' or '.'
 * @return {boolean}
 */
export default function isValidSudoku(board) {
  // one set of seen digits per row, per column and per 3x3 box
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const d = board[r][c];
      // empty cells can't break a rule
      if (d === '.') continue;
      // boxes are numbered 0-8, left to right then top to bottom
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      // a digit seen before in any of its three units is a repeat
      if (rows[r].has(d) || cols[c].has(d) || boxes[b].has(d)) return false;
      rows[r].add(d);
      cols[c].add(d);
      boxes[b].add(d);
    }
  }
  return true;
}
