---
title: Single Number
type: dsa
difficulty: easy
topic: bit-manipulation
order: 1
neetcode: true
tags: [arrays, bit-manipulation, xor]
estimatedMinutes: 10
---

You get a non-empty array of integers `nums` where every value appears **exactly twice**, except for one value that appears only once. Return that single value.

Aim for O(n) time and O(1) extra space.

```js
function singleNumber(nums) // → number
```

## Examples

```text
Input:  nums = [2,2,1]
Output: 1

Input:  nums = [4,1,2,1,2]
Output: 4

Input:  nums = [1]
Output: 1
```

## Constraints

- 1 ≤ `nums.length` ≤ 3·10⁴ (always odd)
- −3·10⁴ ≤ `nums[i]` ≤ 3·10⁴
- Every element appears twice except one, which appears once

## Notes

- **Identify:** every value appears twice except one, O(1) space → XOR everything
- **Key formula:** a ^ a = 0 and a ^ 0 = a, in any order
- **Brute force:** count occurrences in a hash map and find the count of 1, O(n) space
- **Insight:** XOR cancels each pair, so only the single value survives
- **Steps:** result = 0; XOR every number into it; return result
- **Complexity:** O(n) time either way; O(n) → O(1) space
- **Pitfall:** works for negatives and zero too; it relies on every other value appearing exactly twice
- **Related:** Missing Number, Contains Duplicate, Find the Duplicate Number
