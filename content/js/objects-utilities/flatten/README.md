---
title: Flatten
type: js
difficulty: medium
topic: objects-utilities
order: 13
tags: [arrays, recursion, lodash]
estimatedMinutes: 15
---

Implement `flatten(array)`. It returns a **new** array with every nested array, at any depth, flattened into a single level.

- Items keep their original left-to-right order.
- Only real arrays (`Array.isArray`) are flattened. Strings, objects and array-like objects (`{ length: 1, 0: 'x' }`) are kept as single items, by reference.
- Empty arrays at any depth contribute nothing.
- `null` and `undefined` items are kept. **Holes** in sparse arrays become `undefined` (like lodash's `flattenDeep`, unlike `Array.prototype.flat`, which drops them).
- Always return a new array, even when the input is already flat.
- Don't use `Array.prototype.flat`, and don't mutate the input or any nested array.

```js
flatten([1, [2, [3, [4]], 5]]); // [1, 2, 3, 4, 5]
flatten([[], [[]], 1]); // [1]
flatten([1, , [2]]); // [1, undefined, 2]
```

**Constraints:** there is no `depth` argument; everything is flattened. Inputs can be nested a few hundred levels deep.

## Notes

- **Approach (the reference):** treat a copy as a stack. `shift` an item; if it's an array, `unshift(...item)` its children back to the front, otherwise push it to the result. Order is preserved, and there is no recursion, so depth can't blow the call stack.
- **Recursive version:** `for (const x of arr) Array.isArray(x) ? out.push(...flatten(x)) : out.push(x)`. It's the easiest to write in an interview.
- **Pitfalls:** `reduce`, `forEach` and `map` **skip holes**, so a `reduce`/`concat` one-liner returns `[1, 2]` for `[1, , [2]]`. Use `for...of`, an index loop or spread, which read holes as `undefined`. `x instanceof Array` misses arrays from other realms; prefer `Array.isArray`. `push(...hugeArray)` can hit argument-count limits on very large inputs.
- **Complexity:** O(n) items for the recursive and `pop`/reverse versions. `shift`/`unshift` is O(n) each, so the reference is O(n²) in the worst case; iterate from the end with `pop`/`push` and reverse once at the end to fix that.
- **Follow-ups:** a `depth` argument like `flat(depth)`, a lazy generator version (`function*` with `yield*`), and matching `flat`'s hole-dropping behaviour.
