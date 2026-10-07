/**
 * @param {object} obj
 * @param {string} [separator='.']
 * @return {Record<string, *>}
 */
export default function flattenObject(obj, separator = '.') {
  const result = {};

  function walk(value, prefix) {
    for (const [key, child] of Object.entries(value)) {
      const path = prefix === null ? key : prefix + separator + key;
      if (isContainer(child) && Object.keys(child).length > 0) {
        walk(child, path);
      } else {
        // Primitives, null, non-plain objects and empty containers are leaves.
        result[path] = child;
      }
    }
  }

  walk(obj, null);
  return result;
}

function isContainer(value) {
  if (Array.isArray(value)) return true;
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
