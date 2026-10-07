/**
 * @param {any} thisArg
 * @param {...any} args
 * @return {any}
 */
export default function myCall(thisArg, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('myCall must be called on a function');
  }

  const ctx = thisArg == null ? globalThis : Object(thisArg);
  // A unique Symbol can't collide with any existing property.
  const key = Symbol('fn');
  ctx[key] = this;
  try {
    return ctx[key](...args);
  } finally {
    delete ctx[key];
  }
}
