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

- **Identify:** fewest removals so nothing overlaps → keep the most intervals: greedy by earliest end
- **Brute force:** try every subset of intervals to keep, O(2^n)
- **Insight:** keeping the interval that ends first leaves the most room for the rest (activity selection)
- **Steps:** sort by end; keep the first; for each next, if start ≥ last kept end keep it, else remove it
- **Complexity:** O(2^n) → O(n log n) time, O(1) extra space
- **Pitfall:** touching intervals ([1, 2] and [2, 3]) don't overlap here, so use ≥
- **Related:** Merge Intervals, Meeting Rooms, Minimum Interval to Include Each Query
