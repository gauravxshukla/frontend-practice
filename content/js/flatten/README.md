---
title: Flatten
type: js
difficulty: medium
tags: [arrays, recursion, lodash]
estimatedMinutes: 15
---

Implement `flatten(array)`, which returns a new array with every nested array flattened to a single level.

```js
flatten([1, [2, [3, [4]], 5]]); // [1, 2, 3, 4, 5]
flatten([[], [[]], 1]);          // [1]
```

Don't use `Array.prototype.flat`. Don't mutate the input.

## Notes

- Iterative approach (the reference): treat a copy as a stack/queue. `shift` an item; if it's an array, `unshift(...item)` its children back to the front, otherwise push it to the result. Order is preserved.
- `shift`/`unshift` are O(n). For large inputs, iterate from the end with `pop`/`push` and reverse once at the end.
- Recursive one-liner: `arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), [])`.
- Follow-up: support a `depth` argument like `flat(depth)`.
