---
title: Insert Interval
type: dsa
difficulty: medium
tags: [intervals, blind75]
estimatedMinutes: 20
---

You get a list of **non-overlapping** intervals, sorted by start, and a `newInterval`. Insert it and merge where necessary. Return the resulting sorted, non-overlapping list.

```js
insert([[1, 3], [6, 9]], [2, 5]);                         // [[1, 5], [6, 9]]
insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]); // [[1, 2], [3, 10], [12, 16]]
```

## Notes

- Three phases in one pass, with no sort needed since the input is already sorted:
  1. Push every interval that ends **before** `newInterval` starts.
  2. Merge every interval that overlaps: `start = min`, `end = max`. Then push the merged one.
  3. Push the rest.
- O(n) time. Using merge-intervals after appending (O(n log n)) is a valid fallback, but it doesn't use the sorted input.
