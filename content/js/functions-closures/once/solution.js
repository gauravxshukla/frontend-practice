/**
 * @param {Function} func
 * @return {Function}
 */
export default function once(func) {
  let called = false;
  let result;

  return function (...args) {
    if (called) return result;
    // Mark as used first, so a throwing or re-entrant func still runs only once.
    called = true;
    result = func.apply(this, args);
    func = undefined;
    return result;
  };
}
