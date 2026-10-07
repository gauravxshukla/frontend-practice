/**
 * @param {Array} arr
 * @param {(value: any) => string | number} iteratee
 * @return {Object<string, number>}
 */
export default function countBy(arr, iteratee) {
  const result = {};

  arr.forEach((currentItem) => {
    const key = iteratee(currentItem);
    if (Object.hasOwn(result, key)) {
      result[key] += 1;
    } else {
      result[key] = 1;
    }
  });

  return result;
}
