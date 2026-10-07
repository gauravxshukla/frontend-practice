/**
 * @param {Function} func
 * @param {number} n
 * @return {Function}
 */
export default function limit(func, n) {
  let count = n;
  let oldResult;

  return function limited(...args) {
    if (count > 0) {
      count -= 1;
      oldResult = func.apply(this, args);
    }
    return oldResult;
  };
}
