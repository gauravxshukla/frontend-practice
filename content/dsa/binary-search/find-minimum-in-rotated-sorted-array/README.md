---
title: Find Minimum in Rotated Sorted Array
type: dsa
difficulty: medium
topic: binary-search
order: 4
neetcode: true
tags: [arrays, binary-search]
estimatedMinutes: 15
---

An ascending array of **distinct** integers was rotated some number of times (between 0 and `n`). Rotating once moves the last element to the front, so `[1,2,3,4,5]` rotated twice becomes `[4,5,1,2,3]`.

Given the rotated array `nums`, return its smallest value in O(log n) time.

```js
function findMin(nums) // → number
```

## Examples

```text
Input:  nums = [3,4,5,1,2]
Output: 1

Input:  nums = [4,5,6,7,0,1,2]
Output: 0

Input:  nums = [11,13,15,17]
Output: 11
Explanation: rotated a full n times, so it looks unrotated.
```

## Constraints

- 1 ≤ `nums.length` ≤ 5000
- −5000 ≤ `nums[i]` ≤ 5000
- All values are distinct.

## Notes

- **Key insight:** compare `nums[mid]` with `nums[hi]`. If `nums[mid] > nums[hi]`, the rotation point is strictly right of `mid`. Otherwise `mid … hi` is sorted and the minimum is at `mid` or to its left.
- Loop `while (lo < hi)`: either `lo = mid + 1` or `hi = mid`. When they meet, `nums[lo]` is the answer.
- O(log n) time, O(1) space. Brute force is `Math.min(...nums)` in O(n).
- Pitfall: comparing against `nums[lo]` instead of `nums[hi]` breaks on an unrotated array, because the left half also looks sorted.
- Pitfall: `hi = mid - 1` can skip the minimum when `mid` is the minimum.
- Edge cases: one element, two elements, no rotation, rotation by `n − 1` (minimum at the end).
- Follow-up: with duplicates allowed (LeetCode 154), when `nums[mid] === nums[hi]` you can only shrink `hi--`, and the worst case becomes O(n).
