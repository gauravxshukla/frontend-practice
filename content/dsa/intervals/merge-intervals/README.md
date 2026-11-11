---
title: Merge Intervals
type: dsa
difficulty: medium
topic: intervals
order: 2
neetcode: true
tags: [intervals, sorting]
estimatedMinutes: 20
---

Given an array of intervals `[start, end]`, merge all overlapping intervals and return the result sorted by start. Intervals that touch (`[1, 4]` and `[4, 5]`) count as overlapping.

```js
merge([[1, 3], [2, 6], [8, 10], [15, 18]]); // [[1, 6], [8, 10], [15, 18]]
merge([[1, 4], [4, 5]]);                    // [[1, 5]]
```

Don't mutate the input.

## Notes

- **Identify:** combine all overlapping intervals → sort by start, then sweep
- **Brute force:** repeatedly find and merge any overlapping pair until none remain, O(n²) or worse
- **Insight:** after sorting by start, an interval can only overlap the last merged one
- **Steps:** sort by start; if the next start ≤ last end, extend last end to the max; else push a new interval
- **Complexity:** O(n²) → O(n log n) time, O(n) space
- **Pitfall:** extend with max(last end, end), since a later interval can sit entirely inside the last one
- **Related:** Insert Interval, Non-overlapping Intervals, Meeting Rooms II
