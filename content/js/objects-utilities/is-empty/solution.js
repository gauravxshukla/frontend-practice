/**
 * @param {*} value
 * @return {boolean}
 */
export default function isEmpty(value) {
  if (value == null) return true;

  if (isArrayLike(value)) return value.length === 0;

  if (value instanceof Map || value instanceof Set) return value.size === 0;

  // Numbers, booleans, bigints and symbols are not collections.
  if (typeof value !== 'object' && typeof value !== 'function') return true;

  return Object.keys(value).length === 0;
}

function isArrayLike(value) {
  if (typeof value === 'string') return true;
  if (typeof value !== 'object') return false;
  const { length } = value;
  return Number.isInteger(length) && length >= 0;
}
