/**
 * @param {(value: any, index: number, array: any[]) => boolean} callbackFn
 * @param {any} [thisArg]
 * @return {any[]}
 */
export default function myFilter(callbackFn, thisArg) {
  if (typeof callbackFn !== 'function') {
    throw new TypeError('callbackFn is not a function');
  }

  const arrLength = this.length;
  const result = [];

  for (let i = 0; i < arrLength; i++) {
    const currentValue = this[i];
    if (Object.hasOwn(this, i) && callbackFn.call(thisArg, currentValue, i, this)) {
      result.push(currentValue);
    }
  }
  return result;
}
