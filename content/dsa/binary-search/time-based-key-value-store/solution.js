export default class TimeMap {
  constructor() {
    // key -> array of [timestamp, value], already sorted because timestamps only increase
    this.store = new Map();
  }

  /**
   * @param {string} key
   * @param {string} value
   * @param {number} timestamp strictly increasing across all set() calls
   * @return {void}
   */
  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key).push([timestamp, value]);
  }

  /**
   * @param {string} key
   * @param {number} timestamp
   * @return {string} value with the largest stored timestamp <= timestamp, or ""
   */
  get(key, timestamp) {
    const entries = this.store.get(key);
    if (!entries) return '';

    // Find the last entry whose timestamp is <= the query.
    let lo = 0;
    let hi = entries.length - 1;
    let answer = '';
    while (lo <= hi) {
      const mid = lo + ((hi - lo) >> 1);
      if (entries[mid][0] <= timestamp) {
        answer = entries[mid][1];
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return answer;
  }
}
