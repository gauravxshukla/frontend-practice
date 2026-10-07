/**
 * @param {*} value
 * @return {*}
 */
export default function camelCaseKeys(value) {
  if (Array.isArray(value)) return value.map(camelCaseKeys);
  if (!isPlainObject(value)) return value;

  const result = {};
  for (const [key, child] of Object.entries(value)) {
    result[toCamelCase(key)] = camelCaseKeys(child);
  }
  return result;
}

function toCamelCase(key) {
  return key
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word, i) => (i === 0 ? word[0].toLowerCase() : word[0].toUpperCase()) + word.slice(1))
    .join('');
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
