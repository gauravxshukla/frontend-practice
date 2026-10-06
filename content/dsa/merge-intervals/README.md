---
title: Merge Intervals
type: dsa
difficulty: medium
tags: [intervals, sorting, blind75]
estimatedMinutes: 20
---

Given an array of intervals `[start, end]`, merge all overlapping intervals and return the result sorted by start. Intervals that touch (`[1, 4]` and `[4, 5]`) count as overlapping.

```js
merge([[1, 3], [2, 6], [8, 10], [15, 18]]); // [[1, 6], [8, 10], [15, 18]]
merge([[1, 4], [4, 5]]);                    // [[1, 5]]
```

Don't mutate the input.

## Notes

- Sort by start, then sweep: if the current start is ≤ the last merged end, extend `last[1] = max(last[1], end)`. Otherwise push a new interval.
- `max` matters for containment: `[1, 10]` and `[2, 3]` give `[1, 10]`.
- O(n log n) for the sort, O(n) for the output.
- Copy the intervals (`[...arr].sort`, `[s, e]`) so the input isn't mutated.
