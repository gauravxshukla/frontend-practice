---
title: K Closest Points to Origin
type: dsa
difficulty: medium
topic: heap
order: 3
neetcode: true
tags: [heap, priority-queue, geometry, quickselect]
estimatedMinutes: 15
---

You get an array of `points`, where each point is `[x, y]` on a plane, and an integer `k`. Return the `k` points closest to the origin `(0, 0)`, using ordinary Euclidean distance `√(x² + y²)`.

You can return the points in any order. The test data guarantees the answer is unique (no tie at the k-th place).

```js
function kClosest(points, k) // → number[][]
```

## Examples

```text
Input:  points = [[1,3],[-2,2]], k = 1
Output: [[-2,2]]
Explanation: distance² of [1,3] is 10 and of [-2,2] is 8, so [-2,2] is closer.

Input:  points = [[3,3],[5,-1],[-2,4]], k = 2
Output: [[3,3],[-2,4]]
```

## Constraints

- 1 ≤ `k` ≤ `points.length` ≤ 10⁴
- −10⁴ ≤ `x`, `y` ≤ 10⁴

## Notes

- **Key insight:** you never need the actual square root. Comparing `x² + y²` orders points the same way and stays exact in integers.
- **Max-heap of size k:** push each point, and pop the farthest whenever the size exceeds k. What remains is the answer. O(n log k) time, O(k) space.
- **Quickselect:** partition around a pivot distance until the first k slots hold the k smallest. O(n) average, O(n²) worst case, O(1) extra space. It's a good follow-up to mention.
- Brute force: sort all points by distance and take the first k, O(n log n). That's fine to say first.
- Pitfall: a min-heap of all n points, then popping k times, is O(n + k log n). That's acceptable but doesn't use the "size k" idea that matters for streaming input.
- Pitfall: `Math.sqrt` introduces floats for no reason.
- Edge cases: `k === points.length` (return everything), points at the origin, duplicate points.
- Follow-up: points arrive as a stream that doesn't fit in memory, which is where the size-k heap wins.
