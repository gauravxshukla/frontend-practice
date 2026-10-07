---
title: Array.prototype.reduce
type: js
difficulty: easy
topic: polyfills
order: 3
tags: [polyfill, arrays, this]
estimatedMinutes: 15
---

Implement `Array.prototype.myReduce`, a polyfill for `Array.prototype.reduce`. Export it as `export default function myReduce(callbackFn, initialValue)`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myReduce = myReduce;
[1, 2, 3, 4].myReduce((acc, n) => acc + n, 0); // 10
[1, 2, 3, 4].myReduce((acc, n) => acc + n); // 10 (starts from 1, index 1)
['a', 'b'].myReduce((acc, s, i) => acc + s + i, ''); // 'a0b1'
```

- `callbackFn(accumulator, value, index, array)` is called once per element, left to right; its return value becomes the next accumulator. Return the final accumulator.
- **With an `initialValue`**, the accumulator starts as that value and iteration starts at index 0. Passing `undefined` explicitly still counts as providing one.
- **Without an `initialValue`**, the accumulator starts as the first **present** element and iteration continues from the index after it.
- **Skip holes** in sparse arrays: the callback is never called for them.
- Read the length **once**, before iterating. Elements appended during iteration aren't visited.

**Constraints:**
- Throw a `TypeError` if `callbackFn` isn't a function.
- Throw a `TypeError` when there's no `initialValue` and the array has no present elements (empty, or only holes).
- A single-element array with no `initialValue` returns that element without calling the callback.

## Notes

- **Detecting "no initial value":** check `arguments.length < 2`, not `initialValue === undefined`. `[].reduce(fn, undefined)` is legal and returns `undefined`.
- **Seeding:** without an initial value, scan forward with `while (k < len && !(k in this)) k++` to find the first present element; if none, throw.
- **Holes:** `k in this` (or `Object.hasOwn`) before every callback call.
- **Complexity:** O(n) time, O(1) extra space.
- **Pitfalls:** starting the loop at index 1 unconditionally (wrong for `[, 5, 6]`), treating `0`/`''` as "no initial value", and re-reading `this.length` each iteration.
- **Follow-ups:** `reduceRight` (same, iterating from the end), and implementing `map`/`filter` on top of `reduce`.
