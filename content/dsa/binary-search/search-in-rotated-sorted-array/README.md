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

- **Key insight:** whichever way you split a rotated array at `mid`, at least one half is fully sorted. You can tell which by comparing `nums[lo]` with `nums[mid]`.
- If the left half is sorted and `nums[lo] <= target < nums[mid]`, search left. Otherwise search right. Mirror the logic when the right half is the sorted one.
- O(log n) time, O(1) space. Brute force is `indexOf` in O(n).
- Alternative: first find the rotation point (like *Find Minimum*), then do a normal binary search in the correct half. Two passes, same complexity.
- Pitfall: use `nums[lo] <= nums[mid]` (with `=`). When `lo === mid` the "left half" is one element and it counts as sorted.
- Pitfall: getting the strict/non-strict bounds wrong on the range checks, which drops targets sitting at `lo` or `hi`.
- Edge cases: one element, two elements, no rotation, target at the pivot, target missing.
- Follow-up: with duplicates (LeetCode 81) you can't always tell which half is sorted, so the worst case degrades to O(n).
