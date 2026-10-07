export default class MinStack {
  constructor() {
    // Each entry stores the value and the minimum of the stack at that height,
    // so the minimum is restored for free when we pop.
    this.stack = [];
  }

  /** @param {number} val */
  push(val) {
    const min = this.stack.length ? Math.min(val, this.getMin()) : val;
    this.stack.push([val, min]);
  }

  /** Removes the top element. */
  pop() {
    this.stack.pop();
  }

  /** @return {number} */
  top() {
    return this.stack[this.stack.length - 1][0];
  }

  /** @return {number} the smallest element currently in the stack */
  getMin() {
    return this.stack[this.stack.length - 1][1];
  }
}
