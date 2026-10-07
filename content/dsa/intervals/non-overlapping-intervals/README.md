---
title: Non-overlapping Intervals
type: dsa
difficulty: medium
topic: intervals
order: 3
neetcode: true
tags: [intervals, greedy, sorting]
estimatedMinutes: 20
---

You get an array of intervals `[start, end]`. Return the **minimum number of intervals to remove** so that the ones left over don't overlap.

Intervals that only touch at an endpoint, like `[1, 2]` and `[2, 3]`, do **not** overlap.

```js
function eraseOverlapIntervals(intervals) // → number
```

## Examples

```text
Input:  intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
Explanation: Removing [1,3] leaves [1,2], [2,3], [3,4], which only touch.

Input:  intervals = [[1,2],[1,2],[1,2]]
Output: 2
Explanation: Keep one copy, remove the other two.

Input:  intervals = [[1,2],[2,3]]
Output: 0
```

## Constraints

- 1 ≤ `intervals.length` ≤ 10⁵
- −5·10⁴ ≤ start < end ≤ 5·10⁴

## Notes

- **Key insight:** removing the fewest is the same as *keeping* the most. To keep the most, always keep the interval that **ends earliest**, since it leaves the most room for everything after it.
- Sort by end. Keep `prevEnd`. For each interval, if `start ≥ prevEnd` keep it (`prevEnd = end`). Otherwise count a removal.
- Equivalent: sort by start, and on overlap remove the one with the larger end (`prevEnd = min(prevEnd, end)`).
- O(n log n) time for the sort, O(1) extra space.
- Brute force: DP for the longest chain of compatible intervals, O(n²). Trying every subset is O(2ⁿ).
- Pitfall: using `>` instead of `≥` makes touching intervals count as overlapping.
- Pitfall: sorting by start and always dropping the *current* interval. Drop whichever ends later.
- Follow-up: this is the classic activity-selection problem. "Minimum Number of Arrows to Burst Balloons" is the same greedy with closed intervals.
