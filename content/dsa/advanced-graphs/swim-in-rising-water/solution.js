class MinHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  // Items are arrays; they are ordered by item[0].
  push(item) {
    const a = this.items;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }

  pop() {
    const a = this.items;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

/**
 * @param {number[][]} grid  n x n distinct elevations
 * @return {number} the earliest time you can reach the bottom-right cell
 */
export default function swimInWater(grid) {
  const n = grid.length;
  // Dijkstra where a path's cost is its highest elevation (minimax path).
  const seen = Array.from({ length: n }, () => new Array(n).fill(false));
  const heap = new MinHeap();
  heap.push([grid[0][0], 0, 0]);
  seen[0][0] = true;

  while (heap.size) {
    const [time, r, c] = heap.pop();
    if (r === n - 1 && c === n - 1) return time;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < n && nc < n && !seen[nr][nc]) {
        seen[nr][nc] = true;
        heap.push([Math.max(time, grid[nr][nc]), nr, nc]);
      }
    }
  }
  return -1; // unreachable for a valid grid
}
