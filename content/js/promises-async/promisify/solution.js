/**
 * @param {Function} fn A function whose last argument is a callback(err, value).
 * @return {Function} A function that returns a Promise.
 */
export default function promisify(fn) {
  return function (...args) {
    // The Promise constructor turns a sync throw into a rejection and ignores extra settles.
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      });
    });
  };
}
