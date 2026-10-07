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

- **Key insight:** build the result one digit at a time, `rev = rev * 10 + digit`, and check for overflow *before* the multiply-and-add.
- Pop digits with `digit = x % 10` and `x = Math.trunc(x / 10)`. In JS `%` keeps the sign of `x`, so negatives work without special handling.
- Overflow check for positives: overflow if `rev > MAX / 10`, or `rev === Math.trunc(MAX / 10)` and `digit > 7` (MAX = 2147483647). For negatives the limits are `MIN / 10` and `digit < −8`.
- Since an input with 10 digits starts with 1 or 2, the final digit is at most 2, so `rev > MAX / 10` alone is a sufficient check in practice; the full check is clearer to an interviewer.
- O(log₁₀|x|) time, O(1) space.
- Baseline: string reverse plus a range check afterwards. Easy in JS, but it relies on numbers bigger than 32 bits, which the problem asks you to avoid.
- Pitfall: `Math.floor` on negatives rounds the wrong way (`Math.floor(−12 / 10)` is −2). Use `Math.trunc`.
- Pitfall: `-0`. Reversing 0 should return 0.
- Follow-up: Palindrome Number, which reverses only half of the digits to avoid overflow entirely.
