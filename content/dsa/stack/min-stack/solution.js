export default class MinStack {
  constructor() {
    // each entry is [value, smallest value at or below this height]
    this.stack = [];
  }

  /** @param {number} val */
  push(val) {
    // the new minimum is the smaller of val and the minimum beneath it
    const min = this.stack.length ? Math.min(val, this.getMin()) : val;
    this.stack.push([val, min]);
  }

  pop() {
    // the pair below already holds the previous minimum, so nothing to recompute
    this.stack.pop();
  }

  /** @return {number} */
  top() {
    return this.stack[this.stack.length - 1][0];
  }

  /** @return {number} */
  getMin() {
    return this.stack[this.stack.length - 1][1];
  }
}
