/**
 * @param {string[][]} grid '1' = land, '0' = water
 * @return {number}
 */
export default function numIslands(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  // sink every land cell connected to (r, c) so it isn't counted again
  const sink = (r, c) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };
  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // land the scan hasn't sunk yet starts a new island
      if (grid[r][c] === '1') {
        islands++;
        sink(r, c);
      }
    }
  }
  return islands;
}
