/**
 * Returns a new object; neither input is mutated.
 * @param {object} target
 * @param {object} source
 * @return {object}
 */
export default function deepMerge(target, source) {
  return merge(target, source);
}

function merge(a, b) {
  if (b === undefined) return clone(a);
  if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b].map(clone);
  if (!isPlainObject(a) || !isPlainObject(b)) return clone(b);

  const out = clone(a);
  for (const key of Object.keys(b)) {
    // An own "__proto__" key (e.g. from JSON.parse) would hit the prototype setter.
    if (key === '__proto__') continue;
    if (b[key] === undefined) continue;
    out[key] = Object.hasOwn(a, key) ? merge(a[key], b[key]) : clone(b[key]);
  }
  return out;
}

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (!isPlainObject(value)) return value;

  const out = {};
  for (const key of Object.keys(value)) {
    if (key !== '__proto__') out[key] = clone(value[key]);
  }
  return out;
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
