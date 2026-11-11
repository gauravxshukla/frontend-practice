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

- **Identify:** k smallest by distance → max-heap of size k (keep the k closest so far)
- **Key formula:** compare x² + y²; the square root doesn't change the order
- **Brute force:** sort all points by distance and take the first k, O(n log n)
- **Insight:** a size-k max-heap evicts the farthest of the current k whenever a closer point arrives
- **Steps:** push each point by distance; if the heap holds more than k, pop the farthest; return the heap
- **Complexity:** O(n log n) → O(n log k) time, O(k) space
- **Pitfall:** use a max-heap for "k smallest"; a min-heap of all n points loses the size-k saving
- **Related:** Kth Largest Element in an Array, Top K Frequent Elements, Last Stone Weight
