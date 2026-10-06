---
title: Array.prototype.map
type: js
difficulty: easy
tags: [polyfill, arrays, this]
estimatedMinutes: 10
---

Implement `myMap`, a polyfill for `Array.prototype.map`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myMap = myMap;
[1, 2, 3].myMap((n) => n * 2); // [2, 4, 6]
```

- `callbackFn(value, index, array)` is called for each element; the result array has the same length as the input.
- Respect the optional `thisArg`.
- **Preserve holes**: `[1, , 3].myMap(fn)` returns an array with a hole at index 1, and doesn't call `fn` for it.

## Notes

- Assign by index (`result[i] = ...`) instead of `push`, which is what keeps holes in place.
- Start with `new Array(length)` or set `result.length = length`, so trailing holes are preserved too.
