/**
 * @param {*} value
 * @param {Array<string>} keys
 * @return {*}
 */
export default function deepOmit(value, keys) {
  const omitted = new Set(keys);

  function omit(current) {
    if (Array.isArray(current)) return current.map(omit);
    if (!isPlainObject(current)) return current;

    const result = {};
    for (const [key, child] of Object.entries(current)) {
      if (!omitted.has(key)) result[key] = omit(child);
    }
    return result;
  }

  return omit(value);
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
