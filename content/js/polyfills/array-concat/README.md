---
title: Array.prototype.concat
type: js
difficulty: medium
topic: polyfills
order: 9
tags: [polyfill, arrays, this]
estimatedMinutes: 15
---

Implement `Array.prototype.myConcat`, a polyfill for `Array.prototype.concat`. Export it as `export default function myConcat(...items)`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myConcat = myConcat;
[1, 2].myConcat([3, 4], 5, [[6]]); // [1, 2, 3, 4, 5, [6]]
[1].myConcat(); // [1] (a new array)
```

- Return a **new array**: the elements of `this`, followed by each argument in order.
- An argument that **is an array** (`Array.isArray`) is spread **one level**: its elements are appended, but nested arrays inside it are appended as-is (not flattened).
- Any other argument (number, string, object, `null`, `undefined`, an array-like `{ length: 2 }`) is appended as a **single element**.
- **Preserve holes**: `[1, , 3].myConcat([4, , 6])` has holes at indexes 1 and 4, and `length` 6.
- Don't mutate `this` or any argument.

**Constraints:** the result must be a different array even when there are no arguments. Ignore `Symbol.isConcatSpreadable` (see Notes).

## Notes

- **Approach:** keep a running write index `n`. For each of `[this, ...items]`: if it's an array, loop `0..length-1` and assign `result[n] = item[i]` only when `i in item`, incrementing `n` either way; otherwise `result[n++] = item`. Finish with `result.length = n` so trailing holes count.
- **Why not `push(...item)`:** spreading turns holes into `undefined`, and very large arrays can hit the engine's argument limit.
- **Shallow:** objects are copied by reference, so `result[0] === original[0]` for object elements.
- **Complexity:** O(total length).
- **Follow-up:** the spec decides whether to spread using `Symbol.isConcatSpreadable` (falling back to `Array.isArray`). Supporting it means checking `item[Symbol.isConcatSpreadable]` first, which lets array-likes opt in and arrays opt out.
