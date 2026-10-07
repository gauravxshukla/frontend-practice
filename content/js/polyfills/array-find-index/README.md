---
title: Array.prototype.findIndex
type: js
difficulty: easy
topic: polyfills
order: 7
tags: [polyfill, arrays, this]
estimatedMinutes: 10
---

Implement `Array.prototype.myFindIndex`, a polyfill for `Array.prototype.findIndex`. Export it as `export default function myFindIndex(callbackFn, thisArg)`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myFindIndex = myFindIndex;
[5, 12, 8, 130].myFindIndex((n) => n > 10); // 1
[5, 8].myFindIndex((n) => n > 10); // -1
```

- Call `callbackFn(value, index, array)` in index order and return the **index of the first element** for which it returns a truthy value.
- Return `-1` when nothing matches (including for an empty array).
- Stop calling the callback after the first match.
- Use `thisArg` as `this` inside the callback.
- **Holes are visited**, as `undefined`. Unlike `forEach`/`some`/`every`, `findIndex` does *not* skip them: `[1, , 3].myFindIndex((v) => v === undefined)` is `1`.

**Constraints:** read the length once up front. Throw a `TypeError` if `callbackFn` isn't a function.

## Notes

- **Approach:** `for (let i = 0; i < len; i++) if (callbackFn.call(thisArg, this[i], i, this)) return i; return -1;`. There's no `i in this` check.
- **Why holes are visited:** `find`/`findIndex`/`findLast`/`findLastIndex` (ES2015+) were specified to read every index, while the older ES5 methods (`forEach`, `map`, `filter`, `some`, `every`, `reduce`) skip missing ones. It's a classic trick question.
- **Pitfalls:** copy-pasting the hole check from another polyfill, and returning `undefined` instead of `-1`.
- **Follow-ups:** `find` (return the value), `findLastIndex` (iterate backwards), and how `indexOf` differs (strict equality, skips holes, can't find `NaN`).
