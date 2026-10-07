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
 * @param {number[][]} times  directed edges [from, to, travelTime], nodes 1..n
 * @param {number} n
 * @param {number} k  the source node
 * @return {number} time for the signal to reach every node, or -1
 */
export default function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);

  // Dijkstra: pop the closest unsettled node, settle it, relax its edges.
  const dist = new Array(n + 1).fill(Infinity);
  const heap = new MinHeap();
  dist[k] = 0;
  heap.push([0, k]);
  let settled = 0;
  let latest = 0;
  while (heap.size) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue; // stale entry
    settled++;
    latest = d; // nodes settle in non-decreasing distance order
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        heap.push([dist[v], v]);
      }
    }
  }
  return settled === n ? latest : -1;
}
