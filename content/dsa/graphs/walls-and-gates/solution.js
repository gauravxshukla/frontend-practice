/**
 * @param {number[][]} rooms -1 wall, 0 gate, 2147483647 empty
 * @return {void} fills each empty room with its distance to the nearest gate
 */
export default function wallsAndGates(rooms) {
  const EMPTY = 2147483647;
  const rows = rooms.length;
  const cols = rooms[0].length;
  // every gate starts the BFS together, so rooms are reached by their nearest gate first
  let queue = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) if (rooms[r][c] === 0) queue.push([r, c]);
  }
  while (queue.length) {
    const next = [];
    for (const [r, c] of queue) {
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr;
        const nc = c + dc;
        // only unvisited empty rooms; walls and already-filled rooms stay as they are
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || rooms[nr][nc] !== EMPTY) continue;
        rooms[nr][nc] = rooms[r][c] + 1;
        next.push([nr, nc]);
      }
    }
    queue = next;
  }
}
