---
title: Memoize
type: js
difficulty: medium
topic: functions-closures
order: 5
tags: [closures, caching, map, this]
estimatedMinutes: 15
---

Implement `memoize(fn, resolver?)`. It returns a wrapper that caches `fn`'s results, so calling it again with the same key returns the cached value without calling `fn`.

- **Cache key:** by default, the **first argument**. Keys are compared like `Map` keys, so objects are matched by reference and `1` and `'1'` are different keys.
- **`resolver`:** if given, it's called with all the arguments (and the same `this`), and its return value is the key.
- **`.cache`:** the wrapper exposes its cache as a `Map` on `memoized.cache` (key → result), so callers can inspect or clear it.
- Forward `this` and all arguments to `fn`.
- Cache every result, including `undefined`.

```js
const square = memoize((n) => {
  console.log('computing', n);
  return n * n;
});
square(4); // logs "computing 4", returns 16
square(4); // returns 16 from the cache

const add = memoize((a, b) => a + b, (a, b) => `${a},${b}`);
add(1, 2); // 3
add(1, 3); // 4 (different key)
square.cache.get(4); // 16
```

**Constraints:** without a resolver, `f(1, 2)` and `f(1, 3)` share a key (only the first argument counts). If `fn` throws, nothing is cached.

## Notes

- **Approach:** create `const cache = new Map()`, return a regular `function` that computes `key = resolver ? resolver.apply(this, args) : args[0]`, checks `cache.has(key)`, otherwise calls `fn.apply(this, args)`, stores it, and returns it. Attach `memoized.cache = cache`.
- **`has` vs `get`:** checking `cache.get(key) !== undefined` would re-run `fn` for every result that is `undefined`.
- **Why Map, not a plain object:** object keys are coerced to strings, so `{}` and `{a: 1}` both become `"[object Object]"`, and `1` collides with `'1'`.
- **Pitfall:** `JSON.stringify(args)` as a default key is slow, loses functions/`undefined`, and treats distinct objects with the same shape as equal.
- **Memory:** an unbounded Map grows forever. Follow-ups: an LRU limit, a TTL, or a `WeakMap` for object keys so entries can be garbage-collected.
- **Complexity:** O(1) average lookup, plus the resolver's cost.
- **Follow-ups:** memoizing async functions (cache the promise, and evict it on rejection), or a multi-argument cache built from nested Maps.
