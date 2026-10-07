/**
 * @template T
 * @param {T} value
 * @return {T}
 */
export default function deepClone(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((currentItem) => deepClone(currentItem));
  }

  return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, deepClone(val)]));
}
