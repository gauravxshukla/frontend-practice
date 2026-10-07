const INF = 2147483647;

/**
 * Fills every empty room (INF) with its distance to the nearest gate (0), in place.
 * -1 is a wall.
 * @param {number[][]} rooms
 * @return {void}
 */
export default function wallsAndGates(rooms) {
  const rows = rooms.length;
  const cols = rows ? rooms[0].length : 0;

  // Multi-source BFS: start from every gate at once.
  let frontier = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === 0) frontier.push([r, c]);
    }
  }

  let distance = 0;
  while (frontier.length) {
    distance++;
    const next = [];
    for (const [r, c] of frontier) {
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr;
        const nc = c + dc;
        // Only unvisited empty rooms; the first visit is the shortest distance.
        if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && rooms[nr][nc] === INF) {
          rooms[nr][nc] = distance;
          next.push([nr, nc]);
        }
      }
    }
    frontier = next;
  }
}
