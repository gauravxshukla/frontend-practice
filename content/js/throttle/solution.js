/**
 * @param {Function} func
 * @param {number} wait
 * @return {Function}
 */
export default function throttle(func, wait) {
  let throttled = false;

  return function throttledFn(...args) {
    if (throttled) return;

    throttled = true;
    setTimeout(() => {
      throttled = false;
    }, wait);
    func.apply(this, args);
  };
}
