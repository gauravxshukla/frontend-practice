---
title: Deep Omit
type: js
difficulty: medium
topic: objects-utilities
order: 15
tags: [objects, recursion]
estimatedMinutes: 15
---

Implement `deepOmit(value, keys)`. It returns a copy of `value` with every property whose name is in `keys` removed, **at every depth**.

- **`keys`** is an array of property names.
- **Plain objects:** rebuilt without the omitted keys. Their remaining values are processed recursively.
- **Arrays:** mapped element by element, so objects inside arrays (at any depth) lose those keys too. Array indexes are never omitted.
- **Everything else is returned as is:** primitives, `null`, `undefined`, functions, and non-plain objects such as `Date` or `Map`.
- Do **not** mutate `value`. Every plain object and array in the result is new.

```js
deepOmit({ a: 1, b: { a: 2, c: 3 }, list: [{ a: 4, d: 5 }] }, ['a']);
// { b: { c: 3 }, list: [{ d: 5 }] }

deepOmit([{ password: 'x', name: 'Ada' }], ['password']);
// [{ name: 'Ada' }]

deepOmit(42, ['a']); // 42
```

**Constraints:** a key is removed wherever it appears, including when its value is an object (the whole subtree goes). If no key matches, the result equals the input but is still a fresh copy.

## Notes

- **Approach:** a recursive function with three branches. Arrays → `value.map(recurse)`. Plain objects → loop over `Object.entries`, skip omitted keys, recurse into the rest. Anything else → return as is.
- **Lookups:** turn `keys` into a `Set` once, outside the recursion, for O(1) checks.
- **Pitfalls:** using `delete` on the input mutates it. Recursing into a `Date` with `Object.entries` turns it into `{}`. Forgetting arrays leaves `[{ a: 4 }]` untouched.
- **Complexity:** O(total number of nodes).
- **Follow-ups:** omitting by predicate (`deepOmitBy(value, (v, k) => …)`), omitting by path rather than by name, and redacting instead of removing (`'***'`), which is common for logging secrets.
