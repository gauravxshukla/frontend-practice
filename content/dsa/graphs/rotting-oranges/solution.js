/**
 * @param {number[][]} grid  0 = empty, 1 = fresh, 2 = rotten
 * @return {number} minutes until no fresh orange remains, or -1
 */
export default function orangesRotting(grid) {
  const rows = grid.length;
  const cols = rows ? grid[0].length : 0;
  let fresh = 0;
  let frontier = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) fresh++;
      else if (grid[r][c] === 2) frontier.push([r, c]);
    }
  }

  // BFS level by level; each level is one minute.
  let minutes = 0;
  while (frontier.length && fresh > 0) {
    minutes++;
    const next = [];
    for (const [r, c] of frontier) {
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          next.push([nr, nc]);
        }
      }
    }
    frontier = next;
  }
  return fresh === 0 ? minutes : -1;
}
