---
title: set
type: js
difficulty: medium
topic: objects-utilities
order: 11
tags: [objects, paths, lodash, mutation]
estimatedMinutes: 15
---

Implement `set(object, path, value)`, similar to lodash's `_.set`. It writes `value` at a nested `path`, creating whatever is missing on the way.

Unlike the other utilities in this topic, `set` **mutates `object` in place and returns that same object**.

- **`path`** is a string with dots and/or brackets (`'a.b.c'`, `'a[0].b'`, `'a.0.b'`) or an array of keys (`['a', 0, 'b']`).
- **Missing intermediates** are created:
  - an **array** when the *next* key is an integer index (`0`, `'3'`);
  - a plain **object** otherwise.
- **Existing objects and arrays** along the path are reused, so their other keys are kept.
- **Primitives, `null` and `undefined`** along the path are overwritten with a new container (picked by the same rule).
- An empty path (`''` or `[]`) changes nothing. If `object` is `null` or not an object, return it unchanged.

```js
const obj = { a: { keep: true } };
set(obj, 'a.b.c', 1); // obj is { a: { keep: true, b: { c: 1 } } }
set(obj, 'list[0].id', 7); // obj.list is [{ id: 7 }]
set(obj, ['x', '2'], 'v'); // obj.x is an array of length 3: [ , , 'v']
set({ a: 5 }, 'a.b', 1); // { a: { b: 1 } } (the 5 is replaced)
```

**Constraints:** the return value must be the **same reference** as `object`.

## Notes

- **Approach:** parse the path the same way as `get` (`split(/[.[\]]/).filter(Boolean)`). Walk every key but the last: if `current[key]` isn't an object (`typeof !== 'object'` or `null`), replace it with `isIndex(nextKey) ? [] : {}`. Then step in. Finally assign the last key.
- **Index test:** `/^\d+$/.test(String(key))` matches `0` and `'12'`, but not `'-1'`, `'1.5'` or `''`.
- **Pitfalls:** always creating `{}` gives `{ 0: … }` instead of an array. Checking `!current[key]` replaces an existing `0` or `''` correctly, but it also hides the distinction between "missing" and "primitive", so be explicit.
- **Security follow-up:** `set({}, '__proto__.polluted', 1)` writes to `Object.prototype` (prototype pollution). A real implementation should refuse `__proto__`, `constructor` and `prototype` segments.
- **Complexity:** O(length of path).
- **Follow-ups:** an immutable `setIn` that copies each container along the path (structural sharing, as Redux/Immer do), and `unset`.
