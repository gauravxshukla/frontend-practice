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

- **Key insight:** every round needs the current two largest values, and the remainder goes back in. That's exactly what a **max-heap** gives you in O(log n).
- Heapify the stones, then loop while the heap has 2+ items: pop `y`, pop `x`, push `y − x` if non-zero.
- O(n log n) time, O(n) space.
- Brute force: re-sort the array every round, O(n² log n). With n ≤ 30 it passes, but say why the heap is better.
- In JS you can simulate a max-heap with a min-heap of negated values, or with a comparator as in the reference.
- Pitfall: returning `undefined` instead of `0` when every stone is destroyed.
- Edge cases: a single stone, two equal stones, all stones equal (even vs odd count).
- Follow-up: Last Stone Weight II, where you choose any two stones. It becomes a partition / subset-sum DP.
