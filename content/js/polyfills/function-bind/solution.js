/**
 * @param {any} thisArg
 * @param {...any} boundArgs
 * @return {Function}
 */
export default function myBind(thisArg, ...boundArgs) {
  const target = this;
  if (typeof target !== 'function') {
    throw new TypeError('myBind must be called on a function');
  }

  function bound(...args) {
    const allArgs = [...boundArgs, ...args];
    // Called with `new`: ignore thisArg and construct the target instead.
    if (new.target) {
      return Reflect.construct(target, allArgs, new.target);
    }
    return Reflect.apply(target, thisArg, allArgs);
  }

  if (target.prototype) {
    bound.prototype = Object.create(target.prototype);
  }
  return bound;
}
