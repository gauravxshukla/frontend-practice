---
title: Difference
type: js
difficulty: easy
topic: objects-utilities
order: 3
tags: [array, set, lodash]
estimatedMinutes: 10
---

Implement `difference(array, ...exclude)`. It returns a new array with the values of `array` that are **not** present in any of the `exclude` arrays.

- Equality is **SameValueZero**: like `===`, except `NaN` matches `NaN` (and `0` matches `-0`).
- The order of `array` is kept, and so are its duplicates (only values found in an exclude array are removed).
- Objects are compared by reference.
- With no exclude arrays, return a copy of `array`.
- Do **not** mutate any of the inputs.

```js
difference([2, 1, 2, 3], [2]); // [1, 3]
difference([1, 2, 3, 4, 5], [1, 2], [5]); // [3, 4]
difference([1, NaN, 3], [NaN]); // [1, 3]
```

**Constraints:** the result is always a new array, even when nothing is removed.

## Notes

- **Approach:** put every exclude value into one `Set`, then `array.filter((v) => !set.has(v))`. `Set` already uses SameValueZero, so `NaN` works for free.
- **Why not `includes`/`indexOf`:** `exclude.includes(v)` handles `NaN` but is O(n·m). `indexOf` uses `===` and never finds `NaN`.
- **Complexity:** O(n + m) time, O(m) space, where m is the total length of the exclude arrays.
- **Follow-ups:** `differenceBy(array, values, iteratee)` (compare by a derived key), `differenceWith(array, values, comparator)` for deep equality, and the symmetric difference (`xor`).
