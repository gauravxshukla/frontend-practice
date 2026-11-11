---
title: Missing Number
type: dsa
difficulty: easy
topic: bit-manipulation
order: 5
neetcode: true
tags: [arrays, bit-manipulation, math]
estimatedMinutes: 10
---

You get an array `nums` of `n` **distinct** numbers, all taken from the range `0` to `n` (inclusive). That range has `n + 1` values, so exactly one is missing. Return it.

Aim for O(n) time and O(1) extra space.

```js
function missingNumber(nums) // → number
```

## Examples

```text
Input:  nums = [3,0,1]
Output: 2
Explanation: n = 3, so the range is 0..3 and 2 is missing.

Input:  nums = [0,1]
Output: 2
Explanation: n = 2, so the range is 0..2 and 2 is missing.

Input:  nums = [9,6,4,2,3,5,7,0,1]
Output: 8
```

## Constraints

- 1 ≤ n = `nums.length` ≤ 10⁴
- 0 ≤ `nums[i]` ≤ n
- All values are distinct

## Notes

- **Identify:** one number missing from 0..n → XOR indices with values (or use the sum formula)
- **Key formula:** XOR of 0..n and all nums leaves the missing number (pairs cancel)
- **Brute force:** sort and find the first gap, O(n log n); or a hash set, O(n) space
- **Insight:** every present number cancels with its own index, so only the missing one remains
- **Steps:** result = n; for each i: result ^= i ^ nums[i]
- **Complexity:** O(n log n) → O(n) time, O(n) → O(1) space
- **Pitfall:** start with n, since indices only cover 0..n − 1
- **Related:** Single Number, Find the Duplicate Number, Contains Duplicate
