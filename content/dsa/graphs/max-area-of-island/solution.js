/**
 * @param {number[][]} grid 1 = land, 0 = water
 * @return {number}
 */
export default function maxAreaOfIsland(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  // area of the island containing (r, c), sinking it as we count
  const area = (r, c) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 1) return 0;
    grid[r][c] = 0; // mark first so neighbours don't count this cell again
    return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);
  };
  let best = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) best = Math.max(best, area(r, c));
    }
  }
  return best;
}
