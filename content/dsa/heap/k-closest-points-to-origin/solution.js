// binary heap: before(a, b) is true when a should come out first
class Heap {
  constructor(before) {
    this.before = before;
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
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
 * @param {number[][]} points
 * @param {number} k
 * @return {number[][]}
 */
export default function kClosest(points, k) {
  // squared distance keeps the same order without a square root
  const dist = ([x, y]) => x * x + y * y;
  // max-heap by distance: the farthest of the kept points is on top
  const heap = new Heap((a, b) => dist(a) > dist(b));
  for (const p of points) {
    heap.push(p);
    // more than k kept: the farthest can't be among the k closest
    if (heap.size > k) heap.pop();
  }
  return heap.items;
}
