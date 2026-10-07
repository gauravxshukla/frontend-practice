---
title: Array.prototype.some
type: js
difficulty: easy
topic: polyfills
order: 5
tags: [polyfill, arrays, this]
estimatedMinutes: 10
---

Implement `Array.prototype.mySome`, a polyfill for `Array.prototype.some`. Export it as `export default function mySome(callbackFn, thisArg)`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.mySome = mySome;
[1, 3, 4, 5].mySome((n) => n % 2 === 0); // true (stops at 4)
[1, 3, 5].mySome((n) => n % 2 === 0); // false
```

- Call `callbackFn(value, index, array)` in index order. Return `true` as soon as it returns a **truthy** value, otherwise `false`.
- **Short-circuit:** stop calling the callback after the first truthy result.
- Use `thisArg` as `this` inside the callback.
- **Skip holes** in sparse arrays.
- An **empty array returns `false`**.

**Constraints:** always return a real boolean (`true`/`false`), not the callback's truthy value. Read the length once up front.

## Notes

- **Approach:** a plain `for` loop with `if (i in this && callbackFn.call(thisArg, this[i], i, this)) return true;` and `return false` at the end.
- **Empty array → false:** "does any element match?" has no witnesses. Contrast with `every`, which is vacuously `true`.
- **Pitfalls:** returning the truthy value itself (`'yes'` instead of `true`), using `forEach` (it can't break early), and calling the callback for holes.
- **Complexity:** O(n) worst case, O(k) where k is the index of the first match.
