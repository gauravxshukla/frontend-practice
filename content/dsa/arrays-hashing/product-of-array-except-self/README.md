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

- **Identify:** product of every other element, no division allowed → prefix and suffix products
- **Key formula:** answer[i] = (product of everything left of i) × (product of everything right of i)
- **Brute force:** for each index, multiply all the other elements, O(n²)
- **Better:** build prefix[] and suffix[] arrays, O(n) time, O(n) extra space
- **Insight:** instead of two extra arrays, write prefixes into the output, then multiply in a running suffix
- **Steps:** left-to-right pass stores the product left of i; right-to-left pass multiplies by the running product right of i
- **Complexity:** O(n²) → O(n) time, O(n) → O(1) extra space (output excluded)
- **Pitfall:** total ÷ nums[i] breaks on zeros; one zero or two zeros change every answer
- **Related:** Trapping Rain Water, Maximum Product Subarray
