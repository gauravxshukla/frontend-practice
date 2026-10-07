/**
 * @param {Function} fn
 * @param {Function} [resolver] builds the cache key from the arguments
 * @return {Function & { cache: Map }}
 */
export default function memoize(fn, resolver) {
  const cache = new Map();

  function memoized(...args) {
    const key = resolver ? resolver.apply(this, args) : args[0];
    // `has`, not `get`, so cached `undefined` results count as hits.
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;
  return memoized;
}
