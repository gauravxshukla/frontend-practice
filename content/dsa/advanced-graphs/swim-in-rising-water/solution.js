// binary heap: before(a, b) is true when a should come out first
class Heap {
  constructor(before) {
    this.before = before;
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(value) {
    const a = this.items;
    a.push(value);
    // sift up: swap with the parent while the new item should come out sooner
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.before(a[i], a[parent])) break;
      [a[i], a[parent]] = [a[parent], a[i]];
      i = parent;
    }
  }

  pop() {
    const a = this.items;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      // sift down: swap with whichever child should come out first
      let i = 0;
      while (true) {
        const l = 2 * i + 1;
        const r = l + 1;
        let first = i;
        if (l < a.length && this.before(a[l], a[first])) first = l;
        if (r < a.length && this.before(a[r], a[first])) first = r;
        if (first === i) break;
        [a[i], a[first]] = [a[first], a[i]];
        i = first;
      }
    }
    return top;
  }
}

/**
 * @param {number[][]} grid n x n elevations
 * @return {number}
 */
export default function swimInWater(grid) {
  const n = grid.length;
  const seen = Array.from({ length: n }, () => new Array(n).fill(false));
  // min-heap of [highest elevation on the path so far, r, c]
  const heap = new Heap((a, b) => a[0] < b[0]);
  heap.push([grid[0][0], 0, 0]); // the start cell's height counts too
  seen[0][0] = true;
  while (heap.size) {
    const [time, r, c] = heap.pop();
    // popped in order of path maximum, so the first arrival is the best
    if (r === n - 1 && c === n - 1) return time;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || seen[nr][nc]) continue;
      seen[nr][nc] = true;
      // stepping onto a higher cell raises the time needed for this path
      heap.push([Math.max(time, grid[nr][nc]), nr, nc]);
    }
  }
  return -1; // unreachable: the grid is always connected
}
