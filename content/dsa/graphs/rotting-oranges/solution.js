/**
 * @param {number[][]} grid 0 empty, 1 fresh, 2 rotten
 * @return {number}
 */
export default function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let fresh = 0;
  let queue = []; // the oranges that rotted most recently
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) fresh++;
      else if (grid[r][c] === 2) queue.push([r, c]);
    }
  }
  let minutes = 0;
  // each round spreads rot one step from every newly rotten orange: one minute
  while (queue.length && fresh > 0) {
    const next = [];
    for (const [r, c] of queue) {
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2;
        fresh--;
        next.push([nr, nc]);
      }
    }
    queue = next;
    minutes++;
  }
  // any fresh orange left was never reachable
  return fresh === 0 ? minutes : -1;
}
