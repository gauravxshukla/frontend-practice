---
title: Minimum Interval to Include Each Query
type: dsa
difficulty: hard
topic: intervals
order: 6
neetcode: true
tags: [intervals, heap, sorting, sweep-line]
estimatedMinutes: 40
---

You get a list of `intervals`, each `[left, right]` and inclusive on both ends, so its size is `right − left + 1`. You also get an array of integer `queries`.

For each query `q`, find the **smallest-size** interval that contains it (`left ≤ q ≤ right`) and report that size. If no interval contains `q`, report `-1`. Return the answers in the same order as `queries`.

```js
function minInterval(intervals, queries) // → number[]
```

## Examples

```text
Input:  intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]
Output: [3,3,1,4]
Explanation: q=2 → [2,4] (size 3). q=3 → [2,4] (3). q=4 → [4,4] (1). q=5 → [3,6] (4).

Input:  intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]
Output: [2,-1,4,6]
Explanation: q=19 lies in no interval, so -1.
```

## Constraints

- 1 ≤ `intervals.length` ≤ 10⁵
- 1 ≤ `queries.length` ≤ 10⁵
- 1 ≤ left ≤ right ≤ 10⁷
- 1 ≤ `queries[j]` ≤ 10⁷

## Notes

- **Identify:** smallest interval containing each query point → sort both, sweep with a min-heap by size
- **Brute force:** for each query, scan all intervals for the smallest containing it, O(n·q)
- **Insight:** process queries in increasing order: add intervals that have started, drop ones that have ended, read the heap top
- **Steps:** sort intervals by start and queries (keep indices); push (size, end) as starts ≤ q; pop ends < q; top size or −1
- **Complexity:** O(n·q) → O((n + q) log n) time, O(n + q) space
- **Pitfall:** answer in the original query order, and size counts both ends: right − left + 1
- **Related:** Meeting Rooms II, Merge Intervals, Kth Largest Element in a Stream
