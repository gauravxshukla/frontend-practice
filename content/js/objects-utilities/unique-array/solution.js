/**
 * @template T
 * @param {Array<T>} array
 * @return {Array<T>}
 */
export default function unique(array) {
  // Set keeps insertion order and uses SameValueZero (one NaN survives).
  return [...new Set(array)];
}
