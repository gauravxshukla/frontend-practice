---
title: Array.prototype.filter
type: js
difficulty: easy
topic: polyfills
order: 2
tags: [polyfill, arrays, this]
estimatedMinutes: 10
---

Implement `Array.prototype.myFilter`, a polyfill for `Array.prototype.filter`. Export it as `export default function myFilter(callbackFn, thisArg)`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myFilter = myFilter;
[1, 2, 3, 4].myFilter((n) => n % 2 === 0); // [2, 4]
['a', 'b', 'c'].myFilter((s, i) => i !== 1); // ['a', 'c']
[1, , 3].myFilter(() => true); // [1, 3]
```

- `callbackFn(value, index, array)` is called once per element, left to right. Keep the element when the callback returns a **truthy** value (not just `true`).
- The result holds the **original elements**, not the callback's return values, and is always a **new**, dense array.
- Call the callback with `thisArg` as its `this`.
- **Skip holes** in sparse arrays: the callback is never called for them and they don't appear in the result.
- Read the length **once**, before iterating. Elements appended during iteration aren't visited.
- Don't mutate the original array.

**Constraints:** throw a `TypeError` if `callbackFn` isn't a function, even for an empty array.

## Notes

- **Approach:** read `len = this.length`, start with `result = []`, and for each index where `Object.hasOwn(this, i)` (or `i in this`) is true, `push` `this[i]` if `callbackFn.call(thisArg, this[i], i, this)` is truthy.
- **Holes:** without the `hasOwn` check, `[1, , 3]` would call the callback with `undefined` and could keep it. Unlike `map`, `push` is right here: the result is meant to be dense.
- **Validate up front:** check `typeof callbackFn !== 'function'` before the loop, so `[].myFilter(null)` throws like the native method.
- **Complexity:** O(n) time, O(k) extra space for the k kept elements.
- **Pitfalls:** pushing the callback's return value instead of the element, comparing with `=== true` (drops truthy values like `1` or `'x'`), and an arrow function for `myFilter` (loses `this`).
- **Follow-ups:** implement `filter` on top of `reduce`, write `myFind`/`mySome`/`myEvery` (which short-circuit), or a `partition(arr, pred)` that returns both halves.
