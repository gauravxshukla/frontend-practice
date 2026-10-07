function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * @param {Promise<any>} p1
 * @param {Promise<any>} p2
 * @return {Promise<any>}
 */
export default async function promiseMerge(p1, p2) {
  const [a, b] = await Promise.all([p1, p2]);

  if (typeof a === 'number' && typeof b === 'number') return a + b;
  if (typeof a === 'string' && typeof b === 'string') return a + b;
  if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
  if (isPlainObject(a) && isPlainObject(b)) return { ...a, ...b };

  throw new TypeError('Unsupported data types');
}
