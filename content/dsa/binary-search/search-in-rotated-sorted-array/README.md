---
title: Search in Rotated Sorted Array
type: dsa
difficulty: medium
topic: binary-search
order: 5
neetcode: true
tags: [arrays, binary-search]
estimatedMinutes: 20
---

An ascending array of **distinct** integers may have been rotated at some unknown pivot, so `[0,1,2,4,5,6,7]` could arrive as `[4,5,6,7,0,1,2]`. Given the rotated array `nums` and a `target`, return the index of `target`, or `-1` if it isn't present.

Your solution must run in O(log n) time.

```js
function search(nums, target) // → number
```

## Examples

```text
Input:  nums = [4,5,6,7,0,1,2], target = 0
Output: 4

Input:  nums = [4,5,6,7,0,1,2], target = 3
Output: -1

Input:  nums = [1], target = 0
Output: -1
```

## Constraints

- 1 ≤ `nums.length` ≤ 5000
- −10⁴ ≤ `nums[i]`, `target` ≤ 10⁴
- All values are distinct.

## Notes

- **Identify:** find a target in a rotated sorted array in O(log n) → binary search, one half is always sorted
- **Brute force:** scan every element, O(n)
- **Better:** find the rotation point first, then binary search the right half, two passes
- **Insight:** at any mid, one side is sorted; check whether the target lies in that sorted side's range
- **Steps:** if nums[l] ≤ nums[mid] the left is sorted: go left if target is in [nums[l], nums[mid]); else mirror for the right
- **Complexity:** O(n) → O(log n) time, O(1) space
- **Pitfall:** use ≤ in nums[l] ≤ nums[mid], or a two-element range picks the wrong sorted side
- **Related:** Find Minimum in Rotated Sorted Array, Binary Search, Search a 2D Matrix
