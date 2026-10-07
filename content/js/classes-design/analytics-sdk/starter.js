export default class Analytics {
  /**
   * @param {{ send: (events: Array<{ event: string, props: object }>) => Promise<unknown>, batchSize?: number, flushInterval?: number }} options
   */
  constructor({ send, batchSize = 5, flushInterval = 50 }) {
    // Your code here
  }

  /**
   * @param {string} event
   * @param {object} [props]
   */
  track(event, props = {}) {
    // Your code here
  }

  /** @return {Promise<boolean>} */
  flush() {
    // Your code here
  }

  destroy() {
    // Your code here
  }
}
