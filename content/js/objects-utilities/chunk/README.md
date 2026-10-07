---
title: Chunk
type: js
difficulty: easy
topic: objects-utilities
order: 1
tags: [array, lodash]
estimatedMinutes: 10
---

Implement `chunk(array, size = 1)`. It splits `array` into consecutive groups of `size` elements and returns them as a new array of arrays.

- Groups keep the original order. The last group holds whatever is left, so it may be shorter than `size`.
- `size` defaults to `1`. A fractional size is rounded **down** (`2.7` behaves like `2`).
- If `size` is less than `1` (after flooring), return `[]`.
- An empty array returns `[]`.
- Do **not** mutate `array`.

```js
chunk(['a', 'b', 'c', 'd'], 2); // [['a', 'b'], ['c', 'd']]
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
chunk([1, 2, 3]); // [[1], [2], [3]]
chunk([1, 2, 3], 0); // []
```

**Constraints:** a `size` larger than the array gives a single group containing every element.

## Notes

- **Approach:** step through the array with `i += size` and push `array.slice(i, i + size)`. `slice` already clamps at the end, so the short last group needs no special case.
- **Validate first:** `Math.floor(size)` then bail out on `< 1`. Forgetting this with `size = 0` gives an infinite loop.
- **Complexity:** O(n) time and O(n) extra space.
- **Pitfall:** using `splice` on the input is shorter but mutates it.
- **Follow-ups:** a lazy generator version for huge inputs, or chunking by a predicate or a total byte budget instead of a count.
