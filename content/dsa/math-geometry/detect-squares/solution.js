const keyOf = (x, y) => x + ',' + y;

export default class DetectSquares {
  constructor() {
    this.counts = new Map(); // "x,y" -> number of copies
    this.points = []; // distinct points
  }

  /**
   * @param {number[]} point
   * @return {void}
   */
  add([x, y]) {
    const k = keyOf(x, y);
    if (!this.counts.has(k)) this.points.push([x, y]);
    this.counts.set(k, (this.counts.get(k) ?? 0) + 1);
  }

  /**
   * @param {number[]} point
   * @return {number}
   */
  count([qx, qy]) {
    let total = 0;
    for (const [px, py] of this.points) {
      // p must be the diagonal corner of a square with positive area.
      if (px === qx || Math.abs(px - qx) !== Math.abs(py - qy)) continue;
      total +=
        this.counts.get(keyOf(px, py)) *
        (this.counts.get(keyOf(qx, py)) ?? 0) *
        (this.counts.get(keyOf(px, qy)) ?? 0);
    }
    return total;
  }
}
