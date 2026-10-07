---
title: Array.prototype.forEach
type: js
difficulty: easy
topic: polyfills
order: 4
tags: [polyfill, arrays, this]
estimatedMinutes: 10
---

Implement `Array.prototype.myForEach`, a polyfill for `Array.prototype.forEach`. Export it as `export default function myForEach(callbackFn, thisArg)`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myForEach = myForEach;
const seen = [];
[1, 2, 3].myForEach((n, i) => seen.push(n * 10 + i)); // returns undefined
seen; // [10, 21, 32]
```

- Call `callbackFn(value, index, array)` once per element, in index order.
- Use `thisArg` as `this` inside the callback.
- **Always return `undefined`**, whatever the callback returns.
- **Skip holes** in sparse arrays.
- Read the length **once** up front: elements pushed during iteration aren't visited.

**Constraints:** throw a `TypeError` if `callbackFn` isn't a function. An element deleted before the loop reaches it is skipped, like a hole.

## Notes

- **Approach:** `const len = this.length; for (let i = 0; i < len; i++) if (i in this) callbackFn.call(thisArg, this[i], i, this);`
- **Why check `i in this` inside the loop:** it handles both original holes and elements deleted by the callback.
- **Pitfalls:** using `for...of` (visits holes as `undefined` and sees appended elements), returning the array, or forgetting `thisArg`.
- **Complexity:** O(n).
- **Follow-up:** there's no way to `break` out of `forEach` short of throwing. When you need early exit, use `some`/`every` or a plain loop.
