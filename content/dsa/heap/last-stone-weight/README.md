---
title: Last Stone Weight
type: dsa
difficulty: easy
topic: heap
order: 2
neetcode: true
tags: [heap, priority-queue, simulation]
estimatedMinutes: 10
---

You have a pile of stones with positive integer weights `stones`. Repeat this until at most one stone is left: take the **two heaviest** stones, `y` (heaviest) and `x` (second heaviest), and smash them together.

- If `x === y`, both are destroyed.
- Otherwise the `x` stone is destroyed and the `y` stone becomes `y − x`.

Return the weight of the stone that's left, or `0` if none remain.

```js
function lastStoneWeight(stones) // → number
```

## Examples

```text
Input:  stones = [2,7,4,1,8,1]
Output: 1
Explanation: 8 vs 7 → 1, leaving [2,4,1,1,1]. 4 vs 2 → 2, leaving [2,1,1,1].
             2 vs 1 → 1, leaving [1,1,1]. 1 vs 1 → gone, leaving [1].

Input:  stones = [1]
Output: 1
```

## Constraints

- 1 ≤ `stones.length` ≤ 30
- 1 ≤ `stones[i]` ≤ 1000

## Notes

- **Identify:** repeatedly take the two heaviest items → max-heap
- **Brute force:** sort the stones before every smash, O(n² log n)
- **Insight:** a max-heap returns the two heaviest in O(log n) and takes the leftover back in O(log n)
- **Steps:** heap all stones; while 2+ remain pop y and x; if they differ push y − x; return the last or 0
- **Complexity:** O(n² log n) → O(n log n) time, O(n) space
- **Pitfall:** return 0 when every stone is destroyed; Python's heapq is a min-heap, so store negatives
- **Related:** Kth Largest Element in a Stream, K Closest Points to Origin, Task Scheduler
