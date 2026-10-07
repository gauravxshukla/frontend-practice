---
title: Product of Array Except Self
type: dsa
difficulty: medium
topic: arrays-hashing
order: 7
neetcode: true
tags: [arrays, prefix-product]
estimatedMinutes: 20
---

You get an integer array `nums`. Return a new array where position `i` holds the product of every element of `nums` **except** `nums[i]`.

Don't use division, and aim for O(n) time. Every product fits comfortably in a regular number.

```js
function productExceptSelf(nums) // → number[]
```

## Examples

```text
Input:  nums = [1,2,3,4]
Output: [24,12,8,6]

Input:  nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
Explanation: every product except the one that skips the 0 includes the 0.
```

## Constraints

- 2 ≤ `nums.length` ≤ 10⁵
- −30 ≤ `nums[i]` ≤ 30
- Every prefix and suffix product is exactly representable as a JavaScript number.

## Notes

- **Key insight:** the answer at `i` is (product of everything left of `i`) × (product of everything right of `i`).
- **Pass 1:** walk left to right with a running `prefix` (starting at 1). Store `prefix` into `result[i]`, then multiply it by `nums[i]`.
- **Pass 2:** walk right to left with a running `suffix`. Multiply `result[i]` by `suffix`, then multiply `suffix` by `nums[i]`.
- O(n) time and O(1) extra space, since the output array doesn't count.
- **Baseline:** a nested loop for each position is O(n²).
- Why no division: the "total ÷ nums[i]" trick breaks on zeros. With one zero, only that slot is non-zero. With two or more zeros, everything is zero.
- Pitfall: in JavaScript, `0 * -3` is `-0`. Most graders treat it as 0, but don't be surprised if you see it in a console.
- Follow-up: explain how you'd handle zeros if division *were* allowed (count zeros and track the product of non-zero values).
