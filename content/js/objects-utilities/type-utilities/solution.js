/**
 * @param {*} value
 * @return {string} A lowercase type name such as 'null', 'array' or 'date'.
 */
export default function getType(value) {
  if (value === null) return 'null';

  // Primitives and every kind of function (async, generator, class) are covered by typeof.
  const type = typeof value;
  if (type !== 'object') return type;

  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (value instanceof RegExp) return 'regexp';
  if (value instanceof Map) return 'map';
  if (value instanceof Set) return 'set';
  return 'object';
}
