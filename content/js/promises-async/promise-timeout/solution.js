/**
 * @param {Promise<any> | (() => Promise<any>)} promiseOrFn
 * @param {number} ms
 * @return {Promise<any>}
 */
export default function promiseTimeout(promiseOrFn, ms) {
  return new Promise((resolve, reject) => {
    // A sync throw from promiseOrFn() inside the executor rejects the outer promise.
    const input = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;
    const timer = setTimeout(() => reject(new Error('Timeout')), ms);

    Promise.resolve(input).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (reason) => {
        clearTimeout(timer);
        reject(reason);
      },
    );
  });
}
