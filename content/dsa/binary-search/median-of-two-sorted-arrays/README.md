---
title: Median of Two Sorted Arrays
type: dsa
difficulty: hard
topic: binary-search
order: 7
neetcode: true
tags: [arrays, binary-search, divide-and-conquer]
estimatedMinutes: 40
---

You get two arrays, `nums1` (length `m`) and `nums2` (length `n`), each sorted in ascending order. Return the **median** of all `m + n` values taken together. When the total count is even, the median is the average of the two middle values.

Aim for O(log(m + n)) time, which rules out merging the arrays.

```js
function findMedianSortedArrays(nums1, nums2) // → number
```

Answers are compared with a small floating-point tolerance.

## Examples

```text
Input:  nums1 = [1,3], nums2 = [2]
Output: 2
Explanation: combined = [1,2,3], the middle value is 2.

Input:  nums1 = [1,2], nums2 = [3,4]
Output: 2.5
Explanation: combined = [1,2,3,4], (2 + 3) / 2 = 2.5.
```

## Constraints

- 0 ≤ m, n ≤ 1000, and 1 ≤ m + n ≤ 2000
- −10⁶ ≤ `nums1[i]`, `nums2[i]` ≤ 10⁶
- Either array may be empty, but not both.

## Notes

- **Identify:** median of two sorted arrays in O(log(m + n)) → binary search a partition of the shorter array
- **Key formula:** valid split when maxLeft1 ≤ minRight2 and maxLeft2 ≤ minRight1
- **Brute force:** merge both arrays and take the middle, O(m + n)
- **Insight:** instead of merging, choose how many items come from the short array; the long array's count follows
- **Steps:** binary search i in the short array, j = half − i; fix the split by moving i; median from the four edge values
- **Complexity:** O(m + n) → O(log min(m, n)) time, O(m + n) → O(1) space
- **Pitfall:** search the shorter array, and treat out-of-range edges as −∞ / +∞
- **Related:** Binary Search, Find Minimum in Rotated Sorted Array, Merge k Sorted Lists
