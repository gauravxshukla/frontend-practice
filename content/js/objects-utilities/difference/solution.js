/**
 * @param {Array} array
 * @param {...Array} exclude
 * @return {Array}
 */
export default function difference(array, ...exclude) {
  // Set lookups use SameValueZero, so NaN matches NaN.
  const excluded = new Set(exclude.flat());
  return array.filter((value) => !excluded.has(value));
}
