---
title: Range
type: js
difficulty: easy
topic: objects-utilities
order: 2
tags: [array, lodash]
estimatedMinutes: 10
---

Implement `range(start = 0, end, step)`, lodash style. It returns an array of numbers from `start` up to, but **not including**, `end`, moving by `step` each time.

- **One argument:** `range(n)` means `range(0, n)`.
- **Default step:** `1`, or `-1` when `end < start`, so `range(-4)` counts down.
- **Explicit step:** used as given. If it points away from `end`, the result is `[]`.
- **Step of `0`:** repeats `start` once per unit of distance to `end`, so `range(1, 4, 0)` gives `[1, 1, 1]`.
- `range(0)` returns `[]`.

```js
range(4); // [0, 1, 2, 3]
range(-4); // [0, -1, -2, -3]
range(1, 5); // [1, 2, 3, 4]
range(0, 20, 5); // [0, 5, 10, 15]
range(0, -4, -1); // [0, -1, -2, -3]
range(1, 4, 0); // [1, 1, 1]
range(0); // []
```

**Constraints:** `end` itself is never included. A step in the wrong direction (`range(1, 4, -1)`) returns `[]` instead of looping forever.

## Notes

- **Approach:** normalise the arguments first (shift `start` into `end` when only one is given, pick the default step from the direction), then compute the length up front: `Math.max(Math.ceil((end - start) / (step || 1)), 0)`. Fill with `start + i * step`.
- **Why compute the length:** a `while (start < end)` loop needs separate up/down conditions and hangs on `step = 0` or a step in the wrong direction. One formula handles every case, including the odd lodash `step = 0` rule.
- **Floating point:** `start + i * step` drifts less than repeatedly adding `step`.
- **Complexity:** O(n) time and space.
- **Follow-ups:** a lazy generator `range` for huge or infinite sequences, `rangeRight`, or Python's `range` semantics (where a zero step throws).
