---
title: pick
type: js
difficulty: easy
topic: objects-utilities
order: 12
tags: [objects, paths, lodash]
estimatedMinutes: 15
---

Implement `pick(object, keys)`. It returns a **new** object containing only the listed properties of `object`.

- **`keys`** is an array of strings.
- **Own properties only:** a key is copied only if it is an **own** property of `object` (inherited properties are ignored). Keys that don't exist are skipped silently.
- **Values copied as they are:** this includes `undefined`, as long as the key exists.
- **Dotted paths:** a key containing a dot is a **deep path**. `pick(obj, ['a.b'])` returns `{ a: { b: obj.a.b } }`.
  - Intermediate levels in the result are plain objects that hold only the picked keys.
  - Paths sharing a prefix are merged: `['a.b', 'a.c']` gives `{ a: { b, c } }`.
  - If any segment of a path is missing (or not an own property), that path is skipped.
- If `object` is `null` or `undefined`, return `{}`.
- Do **not** mutate `object`, even when a key and a path inside it are both picked (`['a', 'a.b']`).

```js
const user = { id: 1, name: 'Ada', meta: { role: 'admin', tags: ['x'] } };

pick(user, ['id', 'name']); // { id: 1, name: 'Ada' }
pick(user, ['id', 'missing']); // { id: 1 }
pick(user, ['meta.role']); // { meta: { role: 'admin' } }
pick(user, ['id', 'meta.role', 'meta.nope']); // { id: 1, meta: { role: 'admin' } }
```

**Constraints:** picked values are not deep-cloned (`pick(user, ['meta']).meta === user.meta`).

## Notes

- **Approach:** for each key, split on `.` and walk the source with `Object.hasOwn` at every step. If the walk succeeds, write the value into the result, creating `{}` for each intermediate level that isn't there yet.
- **Why `Object.hasOwn` and not `key in obj` or `obj[key] !== undefined`:** `in` includes inherited keys such as `toString`, and the `undefined` check drops keys that exist with an `undefined` value.
- **Pitfalls:** with `['a', 'a.b']`, `result.a` is a reference to `obj.a`, so adding `b` to it writes into the source. Track the containers you created (a `WeakSet`) and copy anything else before writing.
- **Complexity:** O(total length of all paths).
- **Follow-ups:** `omit` (the inverse), `pickBy(obj, predicate)`, TypeScript's `Pick<T, K>`, and lodash's behaviour of preferring a literal `'a.b'` key over the path.
