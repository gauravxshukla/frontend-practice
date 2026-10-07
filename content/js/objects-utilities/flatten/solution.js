/**
 * @param {Array<any>} inputArr
 * @return {Array<any>}
 */
export default function flatten(inputArr) {
  const result = [];
  const copy = [...inputArr];

  while (copy.length) {
    const currentItem = copy.shift();
    if (Array.isArray(currentItem)) {
      copy.unshift(...currentItem);
    } else {
      result.push(currentItem);
    }
  }
  return result;
}
