---
title: Array.prototype.at
type: js
difficulty: easy
topic: polyfills
order: 8
tags: [polyfill, arrays, this]
estimatedMinutes: 10
---

Implement `Array.prototype.myAt`, a polyfill for `Array.prototype.at`. Export it as `export default function myAt(index)`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myAt = myAt;
const arr = ['a', 'b', 'c'];
arr.myAt(0); // 'a'
arr.myAt(-1); // 'c'
arr.myAt(5); // undefined
```

- A non-negative `index` counts from the start; a **negative** `index` counts back from the end (`-1` is the last element).
- Return `undefined` when the resolved position is out of range (`>= length` or `< 0`).
- **Convert `index` to an integer first**, the way the spec's `ToIntegerOrInfinity` does:
  - convert to a number (`'1'` → `1`);
  - `NaN` (and so `undefined`) → `0`;
  - drop the fractional part, truncating toward zero (`1.7` → `1`, `-1.7` → `-1`);
  - `Infinity` / `-Infinity` stay infinite, so they're always out of range.

**Constraints:** don't mutate the array. A hole at the resolved position reads as `undefined`.

## Notes

- **Approach:** `let n = Math.trunc(Number(index)) || 0;` (this also turns `NaN` and `-0` into `0`), then `const k = n >= 0 ? n : len + n;` and bounds-check `k`.
- **Why not `this[index]`:** that does string property lookup, so `arr['-1']` and `arr[1.7]` are both `undefined`.
- **Pitfalls:** using `Math.floor` (wrong for negatives: `-1.7` should be `-1`, not `-2`), and `parseInt`, which handles `'1e3'` and `Infinity` differently from `Number`.
- **Complexity:** O(1).
- **Follow-up:** the same polyfill works for `String.prototype.at` and typed arrays, since it only needs `length` and indexed access.
