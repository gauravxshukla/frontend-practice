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

- **Key insight (fast exponentiation):** xⁿ = (x²)^(n/2) for even n, and x · (x²)^((n−1)/2) for odd n. Halving n each step takes O(log n) multiplications instead of n.
- Handle negatives up front: if `n < 0`, use `x = 1 / x` and `n = −n`.
- Iterative form: while `n > 0`, if `n` is odd multiply the result by `x`; then `x *= x` and `n = Math.floor(n / 2)`.
- O(log |n|) time, O(1) space (the recursive version uses O(log n) stack).
- Brute force: multiply `x` by itself |n| times, O(|n|). That is about 2 billion steps for n = 2³¹ − 1.
- JS pitfall: `n >> 1` and `n & 1` treat numbers as signed 32-bit ints, so `−(−2³¹)` = 2³¹ breaks with `>>`. Use `Math.floor(n / 2)` and `n % 2`, or `>>>`.
- In languages with fixed-size ints, `−n` overflows for n = −2³¹; widen to 64 bits first.
- Edge cases: `n = 0` gives 1; `x = 1` or `x = −1` with huge `n`; tiny bases underflow to 0.
- Follow-up: modular exponentiation `(xⁿ) mod m`, which is the same loop with `% m` after each multiply.
