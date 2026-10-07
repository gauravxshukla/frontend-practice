/**
 * @param {(value: any, index: number, array: any[]) => any} callbackFn
 * @param {any} [thisArg]
 * @return {number}
 */
export default function myFindIndex(callbackFn, thisArg) {
  if (typeof callbackFn !== 'function') {
    throw new TypeError('callbackFn is not a function');
  }

  const len = this.length;
  // No `i in this` check: findIndex visits holes as undefined.
  for (let i = 0; i < len; i++) {
    if (callbackFn.call(thisArg, this[i], i, this)) {
      return i;
    }
  }
  return -1;
}
