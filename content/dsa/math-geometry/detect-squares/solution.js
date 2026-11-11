export default class DetectSquares {
  constructor() {
    this.counts = new Map(); // "x,y" -> how many times the point was added
  }

  /** @param {number[]} point [x, y] */
  add([x, y]) {
    const key = x + ',' + y;
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
  }

  /**
   * @param {number[]} point [x, y]
   * @return {number}
   */
  count([x, y]) {
    const countAt = (px, py) => this.counts.get(px + ',' + py) ?? 0;
    let total = 0;
    for (const [key, n] of this.counts) {
      const [px, py] = key.split(',').map(Number);
      // a diagonal corner must differ by the same non-zero amount on both axes
      if (Math.abs(px - x) !== Math.abs(py - y) || px === x) continue;
      // the other two corners are then fixed; duplicates multiply the ways
      total += n * countAt(x, py) * countAt(px, y);
    }
    return total;
  }
}
