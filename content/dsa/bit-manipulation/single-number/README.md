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

- **Key insight:** XOR cancels pairs. `a ^ a = 0` and `a ^ 0 = a`, and XOR is commutative and associative, so XOR-ing the whole array leaves only the unpaired value.
- One line: `nums.reduce((acc, n) => acc ^ n, 0)`.
- O(n) time, O(1) space.
- Hash-map baseline: count occurrences and return the value with count 1. O(n) time, O(n) space.
- Sort baseline: sort and scan pairs. O(n log n) time.
- Math trick: `2 · sum(set) − sum(nums)`. O(n) space, and may overflow in fixed-width languages.
- Negatives work fine with XOR in JS, because both sides are converted to the same 32-bit pattern.
- Follow-ups: every value appears **three** times except one (count each bit mod 3), or **two** values appear once (split by the lowest set bit of the total XOR).
