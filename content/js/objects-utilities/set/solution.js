/**
 * Mutates `object` and returns it.
 * @param {object} object
 * @param {string | Array<string | number>} path
 * @param {*} value
 * @return {object}
 */
export default function set(object, path, value) {
  if (object === null || typeof object !== 'object') return object;

  const keys = Array.isArray(path) ? path : String(path).split(/[.[\]]/).filter(Boolean);
  if (keys.length === 0) return object;

  let current = object;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const existing = current[key];
    if (existing === null || typeof existing !== 'object') {
      // The container type depends on the key that will be written into it.
      current[key] = isIndex(keys[i + 1]) ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return object;
}

function isIndex(key) {
  return /^\d+$/.test(String(key));
}
