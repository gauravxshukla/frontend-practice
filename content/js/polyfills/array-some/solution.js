/**
 * @param {(value: any, index: number, array: any[]) => any} callbackFn
 * @param {any} [thisArg]
 * @return {boolean}
 */
export default function mySome(callbackFn, thisArg) {
  if (typeof callbackFn !== 'function') {
    throw new TypeError('callbackFn is not a function');
  }

  const len = this.length;
  for (let i = 0; i < len; i++) {
    if (i in this && callbackFn.call(thisArg, this[i], i, this)) {
      return true;
    }
  }
  return false;
}
