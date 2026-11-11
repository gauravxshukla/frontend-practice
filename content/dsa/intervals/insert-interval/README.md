---
title: Insert Interval
type: dsa
difficulty: medium
topic: intervals
order: 1
neetcode: true
tags: [intervals]
estimatedMinutes: 20
---

You get a list of **non-overlapping** intervals, sorted by start, and a `newInterval`. Insert it and merge where necessary. Return the resulting sorted, non-overlapping list.

```js
insert([[1, 3], [6, 9]], [2, 5]);                         // [[1, 5], [6, 9]]
insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]); // [[1, 2], [3, 10], [12, 16]]
```

## Notes

- **Identify:** add one interval to a sorted, non-overlapping list → three phases: before, overlap, after
- **Brute force:** append it, sort everything again, then run Merge Intervals, O(n log n)
- **Insight:** the list is already sorted, so one pass can copy, merge and copy without sorting
- **Steps:** copy intervals ending before new starts; merge every interval that overlaps into new; add it; copy the rest
- **Complexity:** O(n log n) → O(n) time, O(n) space for the output
- **Pitfall:** touching intervals ([1, 5] and [5, 7]) overlap and must merge (use ≤ / ≥)
- **Related:** Merge Intervals, Non-overlapping Intervals, Meeting Rooms
