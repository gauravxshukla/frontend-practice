---
title: Unique Array
type: js
difficulty: easy
topic: objects-utilities
order: 4
tags: [array, set, lodash]
estimatedMinutes: 5
---

Implement `unique(array)`. It returns a new array with duplicate values removed, keeping the **first** occurrence of each value in its original position.

- Equality is **SameValueZero**: like `===`, except `NaN` equals `NaN`, so at most one `NaN` survives.
- Objects and arrays are compared by **reference**, not by content.
- Do **not** mutate `array`.

```js
unique([2, 1, 2, 3, 1]); // [2, 1, 3]
unique([NaN, 1, NaN]); // [NaN, 1]
unique([1, '1', 1]); // [1, '1']
```

**Constraints:** an empty array returns `[]`, and the result is always a new array.

## Notes

- **One-liner:** `[...new Set(array)]`. A `Set` keeps insertion order and uses SameValueZero, which is exactly the spec.
- **Without `Set`:** `array.filter((v, i) => array.indexOf(v) === i)` is O(n²) and **drops every `NaN`**, because `indexOf(NaN)` is always `-1`. `findIndex((x) => Object.is(x, v))` fixes `NaN` but treats `0` and `-0` as different.
- **Complexity:** O(n) time and space with a `Set`.
- **Follow-ups:** `uniqueBy(array, keyFn)` (dedupe objects by `id`), deep-equality dedupe, or keeping the **last** occurrence instead.
