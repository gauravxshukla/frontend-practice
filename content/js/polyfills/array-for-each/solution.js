/**
 * @param {(value: any, index: number, array: any[]) => void} callbackFn
 * @param {any} [thisArg]
 * @return {undefined}
 */
export default function myForEach(callbackFn, thisArg) {
  if (typeof callbackFn !== 'function') {
    throw new TypeError('callbackFn is not a function');
  }

  const len = this.length;
  for (let i = 0; i < len; i++) {
    if (i in this) {
      callbackFn.call(thisArg, this[i], i, this);
    }
  }
}
