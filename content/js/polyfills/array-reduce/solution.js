/**
 * @param {(accumulator: any, value: any, index: number, array: any[]) => any} callbackFn
 * @param {any} [initialValue]
 * @return {any}
 */
export default function myReduce(callbackFn, initialValue) {
  if (typeof callbackFn !== 'function') {
    throw new TypeError('callbackFn is not a function');
  }

  const len = this.length;
  let k = 0;
  let acc;

  // arguments.length, not `initialValue === undefined`: an explicit undefined is a valid seed.
  if (arguments.length >= 2) {
    acc = initialValue;
  } else {
    while (k < len && !(k in this)) k++;
    if (k >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    acc = this[k];
    k++;
  }

  for (; k < len; k++) {
    if (k in this) {
      acc = callbackFn(acc, this[k], k, this);
    }
  }
  return acc;
}
