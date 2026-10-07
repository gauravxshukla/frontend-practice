/**
 * @param {Array} arr
 * @param {(value: any) => string | number} iteratee
 * @return {Object<string, Array>}
 */
export default function groupBy(arr, iteratee) {
  const result = {};

  arr.forEach((currentItem) => {
    const key = iteratee(currentItem);
    if (Object.hasOwn(result, key)) {
      result[key].push(currentItem);
    } else {
      result[key] = [currentItem];
    }
  });
  return result;
}
