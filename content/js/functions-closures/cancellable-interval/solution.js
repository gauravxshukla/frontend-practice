/**
 * @param {Function} fn
 * @param {number} ms
 * @param {...*} args
 * @return {() => void} cancel
 */
export default function setCancellableInterval(fn, ms, ...args) {
  const id = setInterval(fn, ms, ...args);
  return () => clearInterval(id);
}
