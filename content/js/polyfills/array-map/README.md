---
title: Array.prototype.map
type: js
difficulty: easy
topic: polyfills
order: 1
tags: [polyfill, arrays, this]
estimatedMinutes: 10
---

Implement `Array.prototype.myMap`, a polyfill for `Array.prototype.map`. Export it as `export default function myMap(callbackFn, thisArg)`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myMap = myMap;
[1, 2, 3].myMap((n) => n * 2); // [2, 4, 6]
['a', 'b'].myMap((s, i) => s + i); // ['a0', 'b1']
[1, , 3].myMap((n) => n * 10); // [10, <hole>, 30]
```

- `callbackFn(value, index, array)` is called once per element, left to right. Return a **new** array where each slot holds the callback's return value (even `undefined`).
- Call the callback with `thisArg` as its `this`.
- **Preserve holes**: the result has the same length as the input, the callback is never called for a hole, and the hole stays a hole in the result (including trailing holes).
- Read the length **once**, before iterating. Elements appended during iteration aren't visited.
- Don't mutate the original array.

**Constraints:** throw a `TypeError` if `callbackFn` isn't a function, even for an empty array.

## Notes

- **Approach:** read `len = this.length`, create `result = new Array(len)`, then loop `i` from 0 to `len - 1` and, only if `Object.hasOwn(this, i)` (or `i in this`), set `result[i] = callbackFn.call(thisArg, this[i], i, this)`.
- **Holes:** assigning by index instead of `push` is what keeps holes in place. Starting from `new Array(len)` keeps trailing holes too, so the length matches.
- **Validate up front:** check `typeof callbackFn !== 'function'` before the loop. Otherwise `[].myMap(null)` silently returns `[]` while native `map` throws.
- **Complexity:** O(n) time, O(n) extra space for the result.
- **Pitfalls:** using `push` (collapses holes and shifts indices), using an arrow function for `myMap` (loses `this`), and re-reading `this.length` each iteration.
- **Follow-ups:** make it work on array-likes (`Array.prototype.myMap.call({ length: 2, 0: 'a', 1: 'b' }, fn)`), implement `map` on top of `reduce`, or explain why `['1', '2', '3'].map(parseInt)` gives `[1, NaN, NaN]`.
