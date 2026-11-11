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

- **Identify:** sorted array rotated at an unknown point, O(log n) → binary search on which half is sorted
- **Brute force:** scan for the smallest value, O(n)
- **Insight:** compare mid with the right end: nums[mid] > nums[r] means the drop (the minimum) is right of mid
- **Steps:** l = 0, r = n − 1; while l < r: if nums[mid] > nums[r] then l = mid + 1, else r = mid; return nums[l]
- **Complexity:** O(n) → O(log n) time, O(1) space
- **Pitfall:** compare with nums[r], not nums[l]; an unrotated array must still return the first element
- **Related:** Search in Rotated Sorted Array, Binary Search, Koko Eating Bananas
