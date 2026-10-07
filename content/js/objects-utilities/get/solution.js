/**
 * @param {object} object
 * @param {string | Array<string | number>} path
 * @param {*} [defaultValue]
 * @return {*}
 */
export default function get(object, path, defaultValue) {
  const keys = Array.isArray(path) ? path : String(path).split(/[.[\]]/).filter(Boolean);

  // Like lodash, an empty path resolves to undefined rather than to the object itself.
  if (keys.length === 0) return defaultValue;

  let current = object;
  for (const key of keys) {
    if (current == null) return defaultValue;
    current = current[key];
  }
  return current === undefined ? defaultValue : current;
}
