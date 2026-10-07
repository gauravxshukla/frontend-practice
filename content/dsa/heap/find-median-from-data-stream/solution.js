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

export default class MedianFinder {
  constructor() {
    this.low = new Heap((a, b) => a > b); // max-heap: smaller half
    this.high = new Heap((a, b) => a < b); // min-heap: larger half
  }

  /**
   * @param {number} num
   * @return {void}
   */
  addNum(num) {
    // Route through low so every value in low stays <= every value in high.
    this.low.push(num);
    this.high.push(this.low.pop());
    // Keep low the same size as high, or one bigger.
    if (this.high.size > this.low.size) this.low.push(this.high.pop());
  }

  /**
   * @return {number} the median of every number added so far
   */
  findMedian() {
    if (this.low.size > this.high.size) return this.low.peek();
    return (this.low.peek() + this.high.peek()) / 2;
  }
}
