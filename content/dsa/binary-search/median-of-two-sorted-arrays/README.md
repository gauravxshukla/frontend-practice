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

- **Key insight:** the median splits the combined values into a left half and a right half of equal size (left gets the extra one when the total is odd). If you take `i` values from `nums1` for the left half, you must take `j = half − i` from `nums2`, so the only unknown is `i`.
- Binary search `i` over `0 … m` on the **shorter** array. The partition is valid when `nums1[i−1] <= nums2[j]` and `nums2[j−1] <= nums1[i]`.
- If `nums1[i−1] > nums2[j]`, you took too many from `nums1` (`hi = i − 1`); otherwise too few (`lo = i + 1`).
- Use `−Infinity`/`+Infinity` for out-of-range neighbours so empty sides need no special case.
- Odd total → `max(left1, left2)`. Even total → average of that and `min(right1, right2)`.
- O(log(min(m, n))) time, O(1) space.
- Brute force: merge both arrays (two pointers) and read the middle, O(m + n). Mention it first, then optimise.
- Pitfall: searching over the longer array lets `j` go negative.
- Edge cases: one empty array, all of `nums1` smaller than all of `nums2`, duplicates across arrays, negative values.
- Follow-up: generalise to "k-th smallest of two sorted arrays", which this partition idea solves directly.
