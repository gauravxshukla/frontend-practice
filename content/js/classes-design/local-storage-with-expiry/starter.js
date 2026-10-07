export default class ExpiringStorage {
  /**
   * @param {{ getItem(key: string): string | null, setItem(key: string, value: string): void, removeItem(key: string): void }} [storage]
   * @param {() => number} [now]
   */
  constructor(storage, now = Date.now) {
    // Your code here
  }

  /**
   * @param {string} key
   * @param {any} value
   * @param {number} [ttlMs]
   */
  setItem(key, value, ttlMs) {
    // Your code here
  }

  /**
   * @param {string} key
   * @return {any}
   */
  getItem(key) {
    // Your code here
  }

  /**
   * @param {string} key
   */
  removeItem(key) {
    // Your code here
  }
}
