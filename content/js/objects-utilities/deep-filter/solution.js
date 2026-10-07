const REMOVE = Symbol('remove');

/**
 * @param {object | Array} obj
 * @param {(value: *) => boolean} predicate
 * @return {object | Array}
 */
export default function deepFilter(obj, predicate) {
  function walk(value) {
    if (Array.isArray(value)) {
      const out = [];
      for (const item of value) {
        const kept = walk(item);
        if (kept !== REMOVE) out.push(kept);
      }
      return out.length > 0 ? out : REMOVE;
    }

    if (isPlainObject(value)) {
      const out = {};
      for (const [key, child] of Object.entries(value)) {
        const kept = walk(child);
        if (kept !== REMOVE) out[key] = kept;
      }
      return Object.keys(out).length > 0 ? out : REMOVE;
    }

    return predicate(value) ? value : REMOVE;
  }

  const result = walk(obj);
  if (result !== REMOVE) return result;
  return Array.isArray(obj) ? [] : {};
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
