/**
 * @param {object} target
 * @param {...any} sources
 * @return {object}
 */
export default function objectAssign(target, ...sources) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const to = Object(target);

  for (const source of sources) {
    if (source == null) continue;
    const from = Object(source);
    // Reflect.ownKeys includes symbol keys; filter to enumerable ones.
    for (const key of Reflect.ownKeys(from)) {
      const desc = Object.getOwnPropertyDescriptor(from, key);
      if (desc && desc.enumerable) {
        to[key] = from[key];
      }
    }
  }
  return to;
}
