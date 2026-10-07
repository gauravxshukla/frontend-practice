export default class EventEmitter {
  /**
   * @param {string} name
   * @param {Function} listener
   * @return {() => void} unsubscribe
   */
  on(name, listener) {
    // Your code here
  }

  /**
   * @param {string} name
   * @param {Function} listener
   * @return {EventEmitter}
   */
  once(name, listener) {
    // Your code here
  }

  /**
   * @param {string} name
   * @param {Function} listener
   * @return {EventEmitter}
   */
  off(name, listener) {
    // Your code here
  }

  /**
   * @param {string} name
   * @param {...any} args
   * @return {boolean}
   */
  emit(name, ...args) {
    // Your code here
  }

  /**
   * @param {string} name
   * @return {number}
   */
  listenerCount(name) {
    // Your code here
  }
}
