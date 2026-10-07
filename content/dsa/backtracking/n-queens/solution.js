/**
 * @param {number} n
 * @return {string[][]}
 */
export default function solveNQueens(n) {
  const result = [];
  const queenCol = []; // queenCol[r] = column of the queen in row r
  const cols = new Set();
  const diag = new Set(); // r - c is constant along a "\" diagonal
  const anti = new Set(); // r + c is constant along a "/" diagonal

  // Place one queen per row, so rows never clash.
  function backtrack(r) {
    if (r === n) {
      result.push(queenCol.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;
      cols.add(c);
      diag.add(r - c);
      anti.add(r + c);
      queenCol.push(c);
      backtrack(r + 1);
      queenCol.pop();
      cols.delete(c);
      diag.delete(r - c);
      anti.delete(r + c);
    }
  }

  backtrack(0);
  return result;
}
