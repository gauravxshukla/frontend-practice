---
title: Flatten Object
type: js
difficulty: medium
topic: objects-utilities
order: 14
tags: [objects, recursion]
estimatedMinutes: 20
---

Implement `flattenObject(obj, separator = '.')`. It turns a nested object into a single-level object whose keys are the paths to each leaf value, joined by `separator`.

- **Nesting:** plain objects and arrays are walked recursively. Array elements use their **index** as the path segment.
- **Leaves:** every other value is a leaf and is copied as is. This includes primitives, `null`, `undefined`, functions, and non-plain objects such as `Date` and `Map`.
- **Empty containers:** an empty nested object or array (`{}` or `[]`) is kept as a value under its path. It is not dropped.
- Do **not** mutate `obj`.

```js
flattenObject({ a: { b: 1, c: { d: 2 } }, e: [1, { f: 3 }] });
// { 'a.b': 1, 'a.c.d': 2, 'e.0': 1, 'e.1.f': 3 }

flattenObject({ a: {}, b: [], c: null });
// { a: {}, b: [], c: null }

flattenObject({ a: { b: 1 } }, '/');
// { 'a/b': 1 }
```

**Constraints:** `flattenObject({})` returns `{}`. Only own enumerable string keys are visited.

## Notes

- **Approach:** a recursive helper `walk(value, prefix)`. For each `[key, child]` of `Object.entries(value)`, build `path = prefix === null ? key : prefix + sep + key`. If `child` is a non-empty plain object or array, recurse; otherwise assign `result[path] = child`.
- **Plain-object check:** `Object.getPrototypeOf(v) === Object.prototype || … === null`. Using `typeof v === 'object'` alone would explode a `Date` into `{}` (it has no own keys) and crash on `null`.
- **Pitfalls:** dropping empty containers loses information, and with them kept, you can rebuild the original with an `unflatten`. An empty-string key at the top level gives a path starting with the separator, so mark "no prefix yet" with `null` rather than testing the prefix for truthiness.
- **Complexity:** O(total number of nodes), plus key-building cost proportional to depth.
- **Follow-ups:** `unflattenObject` (where arrays come back from numeric segments), a `maxDepth` option, bracket-style array paths (`e[1].f`), and circular references (track a `WeakSet` of ancestors).
