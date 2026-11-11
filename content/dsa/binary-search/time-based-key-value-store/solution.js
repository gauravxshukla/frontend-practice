export default class TimeMap {
  constructor() {
    // key -> [timestamp, value] pairs, in the order they were set (so sorted by time)
    this.store = new Map();
  }

  /**
   * @param {string} key
   * @param {string} value
   * @param {number} timestamp
   */
  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, []);
    // timestamps only increase, so appending keeps the list sorted
    this.store.get(key).push([timestamp, value]);
  }

  /**
   * @param {string} key
   * @param {number} timestamp
   * @return {string}
   */
  get(key, timestamp) {
    const entries = this.store.get(key) ?? [];
    let result = ''; // nothing set at or before timestamp yet
    let l = 0;
    let r = entries.length - 1;
    // find the last entry whose time is <= timestamp
    while (l <= r) {
      const mid = l + Math.floor((r - l) / 2);
      if (entries[mid][0] <= timestamp) {
        result = entries[mid][1]; // a candidate; a later one may also fit
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
    return result;
  }
}
