/**
 * @param {number[][]} grid  1 = land, 0 = water
 * @return {number}
 */
export default function maxAreaOfIsland(grid) {
  const rows = grid.length;
  const cols = rows ? grid[0].length : 0;
  let best = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 1) continue;
      // Flood fill this island, counting cells as we sink them.
      let area = 0;
      const stack = [[r, c]];
      grid[r][c] = 0;
      while (stack.length) {
        const [i, j] = stack.pop();
        area++;
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const ni = i + di;
          const nj = j + dj;
          if (ni >= 0 && nj >= 0 && ni < rows && nj < cols && grid[ni][nj] === 1) {
            grid[ni][nj] = 0;
            stack.push([ni, nj]);
          }
        }
      }
      best = Math.max(best, area);
    }
  }
  return best;
}
