---
title: Binary Search
type: dsa
difficulty: easy
topic: binary-search
order: 1
neetcode: true
tags: [arrays, binary-search]
estimatedMinutes: 10
---

You get an array `nums` of **distinct** integers sorted in ascending order, and a `target`. Return the index where `target` sits, or `-1` if it isn't in the array.

Your solution should run in O(log n) time, so a linear scan doesn't count.

```js
function search(nums, target) // → number
```

## Examples

```text
Input:  nums = [-1,0,3,5,9,12], target = 9
Output: 4

Input:  nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 never appears, so the answer is -1.
```

## Constraints

- 1 ≤ `nums.length` ≤ 10⁴
- −10⁴ < `nums[i]`, `target` < 10⁴
- All values in `nums` are distinct and sorted ascending.

## Notes

- **Identify:** sorted array + find a target in O(log n) → classic binary search
- **Brute force:** scan every element, O(n)
- **Insight:** comparing with the middle discards half the range, since sorted order says where the target can be
- **Steps:** l = 0, r = n − 1; while l ≤ r compare nums[mid]; equal → return mid; else move l or r past mid
- **Complexity:** O(n) → O(log n) time, O(1) space
- **Pitfall:** use l ≤ r (a one-element range still needs checking) and move to mid ± 1, or it loops forever
- **Related:** Search a 2D Matrix, Search in Rotated Sorted Array, Koko Eating Bananas
