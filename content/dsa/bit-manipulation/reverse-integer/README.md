---
title: Reverse Integer
type: dsa
difficulty: medium
topic: bit-manipulation
order: 7
neetcode: true
tags: [math, overflow]
estimatedMinutes: 15
---

You get a signed 32-bit integer `x`. Return `x` with its decimal digits reversed, keeping the sign (so `-123` becomes `-321`, and trailing zeros vanish: `120` becomes `21`).

If the reversed value falls outside the signed 32-bit range `[−2³¹, 2³¹ − 1]`, return `0` instead. Pretend you're in an environment that can't hold numbers outside that range: detect the overflow *before* it happens rather than computing a larger number and checking afterwards.

```js
function reverse(x) // → number
```

## Examples

```text
Input:  x = 123
Output: 321

Input:  x = -123
Output: -321

Input:  x = 120
Output: 21
```

## Constraints

- −2³¹ ≤ x ≤ 2³¹ − 1

## Notes

- **Identify:** reverse digits but return 0 on 32-bit overflow → pop digits and check before pushing
- **Brute force:** reverse the digit string and parse it, then range-check (needs 64-bit space)
- **Insight:** check the overflow before rev × 10 + digit happens, so no wider integer is needed
- **Steps:** keep the sign, work on |x|; for each digit, if rev > (limit − digit) / 10 return 0; rev = rev × 10 + digit
- **Complexity:** O(log x) time, O(1) space
- **Pitfall:** the limit differs by sign (2³¹ − 1 vs 2³¹), and |−2³¹| itself overflows an int
- **Related:** Sum of Two Integers, Plus One, Pow(x, n)
