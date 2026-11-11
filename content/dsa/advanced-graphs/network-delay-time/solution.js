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
 * @param {number[][]} times [from, to, time] directed edges
 * @param {number} n nodes labelled 1..n
 * @param {number} k start node
 * @return {number}
 */
export default function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);
  const settled = new Map(); // node -> final shortest time
  // min-heap of [time, node]: the closest unsettled node comes out first
  const heap = new Heap((a, b) => a[0] < b[0]);
  heap.push([0, k]);
  while (heap.size) {
    const [time, node] = heap.pop();
    // an older, longer entry for a node that's already settled
    if (settled.has(node)) continue;
    settled.set(node, time);
    for (const [next, w] of adj[node]) {
      if (!settled.has(next)) heap.push([time + w, next]);
    }
  }
  // the signal needs as long as the farthest node takes; unreachable nodes make it impossible
  if (settled.size < n) return -1;
  return Math.max(...settled.values());
}
