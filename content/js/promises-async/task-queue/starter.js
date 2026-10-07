export default class TaskQueue {
  /**
   * @param {number} concurrency
   */
  constructor(concurrency) {
    // Your code here
  }

  /**
   * @param {() => Promise<any>} task
   * @return {Promise<any>}
   */
  add(task) {
    // Your code here
  }

  /** @return {number} tasks waiting to start */
  get pending() {
    // Your code here
  }

  /** @return {number} tasks currently running */
  get running() {
    // Your code here
  }

  /** @return {Promise<void>} resolves when nothing is running or pending */
  onIdle() {
    // Your code here
  }
}
