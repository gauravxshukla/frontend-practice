// Array-backed binary heap. `before(a, b)` returns true when a should sit above b.
class Heap {
  constructor(before) {
    this.before = before;
    this.data = [];
  }
  get size() {
    return this.data.length;
  }
  peek() {
    return this.data[0];
  }
  push(value) {
    const a = this.data;
    a.push(value);
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.before(a[i], a[parent])) break;
      [a[parent], a[i]] = [a[i], a[parent]];
      i = parent;
    }
  }
  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1;
        const r = l + 1;
        let best = i;
        if (l < a.length && this.before(a[l], a[best])) best = l;
        if (r < a.length && this.before(a[r], a[best])) best = r;
        if (best === i) break;
        [a[best], a[i]] = [a[i], a[best]];
        i = best;
      }
    }
    return top;
  }
}

/**
 * @param {number[][]} points [x, y] pairs
 * @param {number} k
 * @return {number[][]} the k points closest to (0, 0), in any order
 */
export default function kClosest(points, k) {
  const dist = ([x, y]) => x * x + y * y; // squared distance is enough to compare

  // Max-heap of size k: the farthest of the current k candidates sits on top.
  const heap = new Heap((a, b) => dist(a) > dist(b));
  for (const p of points) {
    heap.push(p);
    if (heap.size > k) heap.pop();
  }
  return heap.data;
}
