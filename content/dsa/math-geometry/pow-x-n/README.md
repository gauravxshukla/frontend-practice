---
title: Pow(x, n)
type: dsa
difficulty: medium
topic: math-geometry
order: 6
neetcode: true
tags: [math, recursion, divide-and-conquer]
estimatedMinutes: 20
---

Compute `x` raised to the integer power `n`, that is, xⁿ. `n` may be negative or zero. Don't use `Math.pow` or `**`; the point is to do it efficiently yourself.

Answers are checked with a small relative tolerance (1e-5), so normal floating-point rounding is fine.

```js
function myPow(x, n) // → number
```

## Examples

```text
Input:  x = 2, n = 10
Output: 1024

Input:  x = 2.1, n = 3
Output: 9.261

Input:  x = 2, n = -2
Output: 0.25
Explanation: 2⁻² = 1 / 2² = 1/4.
```

## Constraints

- −100 < x < 100
- −2³¹ ≤ n ≤ 2³¹ − 1
- Either x ≠ 0 or n > 0
- −10⁴ ≤ xⁿ ≤ 10⁴

## Notes

- **Identify:** x to an integer power, n up to ±2³¹ → fast exponentiation by squaring
- **Key formula:** x^n = (x²)^(n/2), times x once more when n is odd
- **Brute force:** multiply x by itself |n| times, O(n)
- **Insight:** square the base and halve the exponent each step; odd bits of n multiply into the result
- **Steps:** if n < 0, x = 1/x and n = −n; while n > 0: if n is odd result *= x; x *= x; n //= 2
- **Complexity:** O(n) → O(log n) time, O(1) space
- **Pitfall:** −2³¹ can't be negated in a 32-bit int; use a 64-bit copy of n (Java long)
- **Related:** Multiply Strings, Sum of Two Integers, Reverse Integer
