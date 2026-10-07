/**
 * @param {any} thisArg
 * @param {ArrayLike<any> | null | undefined} [argsArray]
 * @return {any}
 */
export default function myApply(thisArg, argsArray) {
  if (typeof this !== 'function') {
    throw new TypeError('myApply must be called on a function');
  }
  if (argsArray != null && typeof argsArray !== 'object' && typeof argsArray !== 'function') {
    throw new TypeError('argsArray must be an array-like object');
  }

  // Array.from handles non-iterable array-likes like { length: 2, 0: 'a', 1: 'b' }.
  const args = argsArray == null ? [] : Array.from(argsArray);
  const ctx = thisArg == null ? globalThis : Object(thisArg);
  const key = Symbol('fn');
  ctx[key] = this;
  try {
    return ctx[key](...args);
  } finally {
    delete ctx[key];
  }
}
