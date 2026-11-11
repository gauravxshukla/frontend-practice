---
title: Sum of Two Integers
type: dsa
difficulty: medium
topic: bit-manipulation
order: 6
neetcode: true
tags: [bit-manipulation, math]
estimatedMinutes: 20
---

You get two integers `a` and `b`, each of which may be negative. Return `a + b` **without using the `+` or `-` operators** anywhere in your code (no `+=`, `++` or `--` either). Use bitwise operations instead.

Inputs and the result fit in a signed 32-bit integer, and JavaScript's bitwise operators work on signed 32-bit values, which handles negatives for you.

```js
function getSum(a, b) // → number
```

## Examples

```text
Input:  a = 1, b = 2
Output: 3

Input:  a = 2, b = 3
Output: 5

Input:  a = -2, b = 3
Output: 1
```

## Constraints

- −1000 ≤ a, b ≤ 1000 on LeetCode; here, any a, b whose sum fits in a signed 32-bit integer

## Notes

- **Identify:** add without + or − → XOR adds without carry, AND finds the carries
- **Key formula:** a + b = (a ^ b) + ((a & b) << 1)
- **Brute force:** increment one at a time |b| times, O(|b|)
- **Insight:** repeat "sum without carry" and "carry shifted left" until there is no carry
- **Steps:** while b ≠ 0: carry = (a & b) << 1; a = a ^ b; b = carry; return a
- **Complexity:** O(|b|) → O(32) time, O(1) space
- **Pitfall:** Python ints never overflow, so mask to 32 bits and convert back to a signed value
- **Related:** Reverse Integer, Plus One, Number of 1 Bits
