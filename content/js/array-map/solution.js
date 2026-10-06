/**
 * @param {(value: any, index: number, array: any[]) => any} callbackFn
 * @param {any} [thisArg]
 * @return {any[]}
 */
export default function myMap(callbackFn, thisArg) {
  const arrLength = this.length;
  const result = new Array(arrLength);

  for (let i = 0; i < arrLength; i++) {
    const currentValue = this[i];
    if (Object.hasOwn(this, i)) {
      result[i] = callbackFn.call(thisArg, currentValue, i, this);
    }
  }
  return result;
}
