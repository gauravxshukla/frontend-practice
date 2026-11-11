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
 * @param {number[][]} intervals
 * @param {number[]} queries
 * @return {number[]}
 */
export default function minInterval(intervals, queries) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  // answer queries smallest first, remembering where each answer goes
  const order = queries.map((q, i) => [q, i]).sort((a, b) => a[0] - b[0]);
  const answer = new Array(queries.length).fill(-1);
  // min-heap of [size, right] for intervals that have started
  const heap = new Heap((a, b) => a[0] < b[0]);
  let i = 0;
  for (const [q, idx] of order) {
    // every interval starting at or before q might contain it
    while (i < sorted.length && sorted[i][0] <= q) {
      const [left, right] = sorted[i++];
      heap.push([right - left + 1, right]);
    }
    // intervals ending before q can't contain this or any later query
    while (heap.size && heap.peek()[1] < q) heap.pop();
    if (heap.size) answer[idx] = heap.peek()[0];
  }
  return answer;
}
