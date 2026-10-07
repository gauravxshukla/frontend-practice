---
title: get
type: js
difficulty: easy
topic: objects-utilities
order: 10
tags: [objects, paths, lodash]
estimatedMinutes: 15
---

Implement `get(object, path, defaultValue)`, similar to lodash's `_.get`. It safely reads a nested value and returns `defaultValue` when the value isn't there.

- **`path`** is either:
  - a **string** with dots and/or brackets: `'a.b.c'`, `'a[0].b'`, `'a.0.b'` (bracket and dot segments are interchangeable); or
  - an **array** of keys: `['a', 0, 'b']`. Each array entry is one key, used as is, even if it contains a dot.
- If any intermediate value is `null` or `undefined`, stop and return `defaultValue`.
- Return `defaultValue` **only** when the resolved value is `undefined`. Other falsy results (`null`, `0`, `false`, `''`) are returned as they are.
- An **empty path** (`''` or `[]`) resolves to nothing, so it returns `defaultValue` (lodash behaviour). It does **not** return `object` itself.
- Do **not** mutate `object`.

```js
const obj = { a: [{ b: { c: 3 } }], n: null };

get(obj, 'a[0].b.c'); // 3
get(obj, 'a.0.b.c'); // 3
get(obj, ['a', 0, 'b', 'c']); // 3
get(obj, 'a[1].b', 'none'); // 'none'
get(obj, 'n', 'none'); // null
get(obj, [], 'none'); // 'none'
```

**Constraints:** values along the path can be primitives, and their properties are read normally, so `get({ s: 'hi' }, 's.length')` is `2`.

## Notes

- **Parsing:** `path.split(/[.[\]]/).filter(Boolean)` turns `'a[0].b'` into `['a', '0', 'b']`. A string index works for arrays because property keys are strings anyway.
- **Walking:** loop over the keys. If the current value is `== null`, bail out with the default; otherwise step into `current[key]`. At the end, `result === undefined ? defaultValue : result`.
- **Pitfalls:** `obj?.a?.b || defaultValue` swallows `0`/`false`/`''`. A `reduce` without the null check throws on `undefined.b`. Treating an empty path as "return the object" differs from lodash.
- **Complexity:** O(length of path).
- **Follow-ups:** quoted bracket keys (`a["x.y"]`), lodash's rule that an exact key match (`{ 'a.b': 1 }` with path `'a.b'`) wins, memoising parsed paths, and the counterpart `set`.
