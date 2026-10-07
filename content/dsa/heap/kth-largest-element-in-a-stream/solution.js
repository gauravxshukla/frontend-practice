class MinHeap {
  constructor() {
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
      if (a[parent] <= a[i]) break;
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
        let smallest = i;
        if (l < a.length && a[l] < a[smallest]) smallest = l;
        if (r < a.length && a[r] < a[smallest]) smallest = r;
        if (smallest === i) break;
        [a[smallest], a[i]] = [a[i], a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

export default class KthLargest {
  /**
   * @param {number} k
   * @param {number[]} nums initial scores
   */
  constructor(k, nums) {
    // Keep only the k largest values; the smallest of them (the heap top) is the answer.
    this.k = k;
    this.heap = new MinHeap();
    for (const n of nums) this.add(n);
  }

  /**
   * @param {number} val
   * @return {number} the k-th largest value seen so far
   */
  add(val) {
    this.heap.push(val);
    if (this.heap.size > this.k) this.heap.pop();
    return this.heap.peek();
  }
}
