---
title: Array.prototype.every
type: js
difficulty: easy
topic: polyfills
order: 6
tags: [polyfill, arrays, this]
estimatedMinutes: 10
---

Implement `Array.prototype.myEvery`, a polyfill for `Array.prototype.every`. Export it as `export default function myEvery(callbackFn, thisArg)`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myEvery = myEvery;
[2, 4, 6].myEvery((n) => n % 2 === 0); // true
[2, 3, 4].myEvery((n) => n % 2 === 0); // false (stops at 3)
```

- Call `callbackFn(value, index, array)` in index order. Return `false` as soon as it returns a **falsy** value, otherwise `true`.
- **Short-circuit:** stop calling the callback after the first falsy result.
- Use `thisArg` as `this` inside the callback.
- **Skip holes** in sparse arrays.
- An **empty array returns `true`**.

**Constraints:** always return a real boolean. Read the length once up front.

## Notes

- **Approach:** `for` loop; `if (i in this && !callbackFn.call(thisArg, this[i], i, this)) return false;` then `return true`.
- **Empty array → true:** "every element matches" is vacuously true when there are no elements. `every` is the dual of `some`: `arr.every(p) === !arr.some((x) => !p(x))`.
- **Holes:** because holes are skipped, `new Array(5).every(() => false)` is `true`, which surprises people.
- **Pitfalls:** returning the callback's falsy value (`0`, `''`) instead of `false`, and not short-circuiting.
- **Complexity:** O(n) worst case.
