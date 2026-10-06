---
title: Array.prototype.filter
type: js
difficulty: easy
tags: [polyfill, arrays, this]
estimatedMinutes: 10
---

Implement `myFilter`, a polyfill for `Array.prototype.filter`. It's attached to the prototype, so `this` is the array:

```js
Array.prototype.myFilter = myFilter;
[1, 2, 3, 4].myFilter((n) => n % 2 === 0); // [2, 4]
```

- `callbackFn(value, index, array)` is called for each element; keep the elements where it returns a truthy value.
- Respect the optional `thisArg` as `this` inside the callback.
- **Skip holes** in sparse arrays (`[1, , 3]`): the callback must not be called for them.
- Don't mutate the original array.

## Notes

- `Object.hasOwn(this, i)` (or `i in this`) is how you skip holes. Without it, `[1, , 3]` would call the callback with `undefined`.
- Read `this.length` once up front: elements appended during iteration aren't visited (spec behaviour).
- `callbackFn.call(thisArg, value, i, this)` forwards `thisArg` correctly.
