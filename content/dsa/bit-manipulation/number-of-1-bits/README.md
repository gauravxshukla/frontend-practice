---
title: Number of 1 Bits
type: dsa
difficulty: easy
topic: bit-manipulation
order: 2
neetcode: true
tags: [bit-manipulation, math]
estimatedMinutes: 10
---

You get a non-negative integer `n` that fits in 32 bits (treat it as **unsigned**, so it can be as large as 2³² − 1). Return how many `1` bits its binary representation has. This count is also called the *Hamming weight*.

```js
function hammingWeight(n) // → number
```

## Examples

```text
Input:  n = 11
Output: 3
Explanation: 11 is 1011 in binary: three 1 bits.

Input:  n = 128
Output: 1
Explanation: 128 is 10000000: one 1 bit.

Input:  n = 2147483645
Output: 30
```

## Constraints

- 0 ≤ n ≤ 2³² − 1

## Notes

- **Identify:** count set bits in an unsigned 32-bit integer → clear the lowest set bit repeatedly
- **Key formula:** n & (n − 1) removes the lowest set bit
- **Brute force:** check all 32 bits one by one with n & 1 and a shift, always 32 steps
- **Insight:** each n & (n − 1) removes exactly one set bit, so the loop runs once per 1 bit
- **Steps:** count = 0; while n ≠ 0: n &= n − 1; count++
- **Complexity:** O(32) → O(set bits) time, O(1) space
- **Pitfall:** treat the input as unsigned: values ≥ 2³¹ must not be read as negative
- **Related:** Counting Bits, Reverse Bits, Single Number
