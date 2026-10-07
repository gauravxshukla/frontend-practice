/**
 * @param {object} object
 * @param {Array<string>} keys Plain keys or dotted deep paths.
 * @return {object}
 */
export default function pick(object, keys) {
  const result = {};
  if (object == null) return result;
  // Containers this function built; anything else in `result` is a reference into `object`.
  const created = new WeakSet([result]);

  for (const key of keys) {
    const segments = String(key).split('.');

    // Walk the source first; skip the path if any segment is missing.
    let source = object;
    let found = true;
    for (const segment of segments) {
      if (source == null || !Object.hasOwn(Object(source), segment)) {
        found = false;
        break;
      }
      source = source[segment];
    }
    if (!found) continue;

    let target = result;
    for (const segment of segments.slice(0, -1)) {
      if (!created.has(target[segment])) {
        const existing = target[segment];
        // Copy a previously picked source object instead of writing into it.
        target[segment] = existing !== null && typeof existing === 'object' ? { ...existing } : {};
        created.add(target[segment]);
      }
      target = target[segment];
    }
    target[segments[segments.length - 1]] = source;
  }
  return result;
}
