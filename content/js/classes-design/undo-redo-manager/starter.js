export default class History {
  /**
   * @param {any} initial
   * @param {{ limit?: number }} [options]
   */
  constructor(initial, { limit } = {}) {
    // Your code here
  }

  /** @return {any} */
  get() {
    // Your code here
  }

  /** @param {any} next @return {any} */
  set(next) {
    // Your code here
  }

  /** @return {any} */
  undo() {
    // Your code here
  }

  /** @return {any} */
  redo() {
    // Your code here
  }

  /** @return {boolean} */
  canUndo() {
    // Your code here
  }

  /** @return {boolean} */
  canRedo() {
    // Your code here
  }

  /** @param {() => void} fn @return {any} */
  batch(fn) {
    // Your code here
  }
}
