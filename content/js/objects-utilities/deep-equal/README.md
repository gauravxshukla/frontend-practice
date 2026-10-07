---
title: Deep Equal
type: js
difficulty: medium
topic: objects-utilities
order: 19
tags: [objects, recursion, lodash]
estimatedMinutes: 20
---

Implement `deepEqual(a, b)`. It returns `true` when two JSON-like values are structurally equal, and `false` otherwise.

- **Primitives** (including `null` and `undefined`) are compared with `===`. So `deepEqual(0, -0)` is `true` and `deepEqual(NaN, NaN)` is `false`.
- **An object and a primitive** are never equal, so `deepEqual([], 0)` and `deepEqual({}, null)` are `false`.
- **An array and a plain object** are never equal, even if their keys match.
- **Two arrays** are equal when they have the same length and deeply equal items in the same order.
- **Two plain objects** are equal when they have the same set of own keys, in any order, and deeply equal values for each key. A key set to `undefined` is **not** the same as a missing key.

```js
deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }); // true
deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }); // true
deepEqual([1, 2], { 0: 1, 1: 2 }); // false (array vs object)
deepEqual({ a: 1 }, { a: 1, b: undefined }); // false (different keys)
deepEqual([1, 2], [2, 1]); // false (order matters in arrays)
```

**Constraints:** inputs contain only primitives, `null`, `undefined`, plain objects and arrays, with no circular references.

## Notes

- **Approach:** fast path `a === b`. If either side isn't a non-null object, return `false` (the `===` already failed). Compare `Array.isArray(a) !== Array.isArray(b)`. Then check that both have the same number of own keys, and that every key of `a` is an own key of `b` (`Object.hasOwn`) with a deeply equal value.
- **Pitfalls:** `typeof null === 'object'`. Comparing "array-ness" before keys matters, otherwise `[1]` and `{ 0: 1 }` look equal. Checking only `a`'s keys without the length check lets `{ a: 1 }` equal `{ a: 1, b: 2 }`. Using `b[key] !== undefined` instead of `Object.hasOwn` makes `{ a: undefined }` equal `{ b: undefined }`. `JSON.stringify(a) === JSON.stringify(b)` breaks on key order and drops `undefined`.
- **Complexity:** O(n) in the total number of values, plus O(depth) call stack.
- **Follow-ups:** `NaN` equal to itself (`Object.is`, which also makes `0` and `-0` unequal; lodash's `isEqual` uses SameValueZero), `Date`/`RegExp`/`Map`/`Set`, prototypes and symbol keys, and cycles (a `WeakMap` of visited pairs).
