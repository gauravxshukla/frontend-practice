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

- **Key insight:** answer the queries **offline**, in increasing order. Then intervals only ever *become* relevant (once `left ≤ q`) and only ever *stop* being relevant (once `right < q`), which is exactly what a heap handles.
- Sort intervals by `left`. Sort query indices by value.
- For each query `q` in order: push every interval with `left ≤ q` onto a min-heap keyed by `(size, right)`. Then pop from the top while its `right < q`, since it can never cover this or any later query.
- The heap top (if any) is the smallest interval covering `q`. Write its size to `answer[originalIndex]`, or `-1`.
- O((n + m) log n + m log m) time, O(n + m) space.
- Brute force: scan every interval for every query, O(n · m), too slow at 10⁵ × 10⁵.
- Pitfall: forgetting to restore the original query order, or not handling duplicate query values.
- Pitfall: size is `right − left + 1` (inclusive), not `right − left`.
- JavaScript has no built-in heap, so write a small binary heap class.
- Follow-up: answer queries online. A segment tree over compressed coordinates with "range chmin" works.
