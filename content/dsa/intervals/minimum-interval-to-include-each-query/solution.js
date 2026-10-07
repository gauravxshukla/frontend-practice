/** Binary min-heap of [size, right] pairs, ordered by size. */
class MinHeap {
  constructor() {
    this.items = [];
  }
  get size() {
    return this.items.length;
  }
  peek() {
    return this.items[0];
  }
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
 * @param {number[][]} intervals
 * @param {number[]} queries
 * @return {number[]}
 */
export default function minInterval(intervals, queries) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const order = queries.map((_, i) => i).sort((a, b) => queries[a] - queries[b]);
  const answer = new Array(queries.length).fill(-1);
  const heap = new MinHeap();
  let i = 0;

  for (const qi of order) {
    const q = queries[qi];
    // Add every interval that has started by q.
    while (i < sorted.length && sorted[i][0] <= q) {
      const [left, right] = sorted[i++];
      heap.push([right - left + 1, right]);
    }
    // Drop intervals that ended before q; they can't cover later queries either.
    while (heap.size && heap.peek()[1] < q) heap.pop();
    if (heap.size) answer[qi] = heap.peek()[0];
  }
  return answer;
}
