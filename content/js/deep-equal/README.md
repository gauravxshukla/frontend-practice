---
title: Deep Equal
type: js
difficulty: medium
tags: [objects, recursion, lodash]
estimatedMinutes: 20
---

Implement `deepEqual(a, b)`. It returns `true` when two JSON-like values are structurally equal: the same primitives, or arrays/plain objects with the same keys and deeply equal values.

```js
deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }); // true
deepEqual([1, 2], { 0: 1, 1: 2 });                   // false (array vs object)
deepEqual({ a: 1 }, { a: 1, b: undefined });         // false (different keys)
```

## Notes

- Fast path: `a === b`.
- If either side isn't a non-null object, they're unequal (the `===` already failed).
- Compare "array-ness" before keys, otherwise `[1]` and `{0: 1}` look equal.
- Same key count, plus every key of `a` is an own key of `b` with a deeply equal value.
- Follow-ups: `NaN` (use `Object.is`), `Date`/`Map`/`Set`, cycles (a `WeakMap` of visited pairs).
