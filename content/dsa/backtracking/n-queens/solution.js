/**
 * @param {number} n
 * @return {string[][]}
 */
export default function solveNQueens(n) {
  const result = [];
  const queenCol = new Array(n).fill(-1); // column of the queen in each row
  // columns and both diagonal directions already under attack
  const cols = new Set();
  const diag = new Set(); // r - c is constant along a "\" diagonal
  const anti = new Set(); // r + c is constant along a "/" diagonal
  const dfs = (r) => {
    // a queen in every row: turn the placement into board strings
    if (r === n) {
      result.push(queenCol.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;
      // place, explore the next row, then remove the queen
      queenCol[r] = c;
      cols.add(c);
      diag.add(r - c);
      anti.add(r + c);
      dfs(r + 1);
      cols.delete(c);
      diag.delete(r - c);
      anti.delete(r + c);
    }
  };
  dfs(0);
  return result;
}
