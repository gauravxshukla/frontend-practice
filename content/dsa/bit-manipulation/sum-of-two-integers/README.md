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

- **Key insight:** binary addition splits into two parts. `a ^ b` is the sum ignoring carries, and `(a & b) << 1` is the carries shifted into place.
- Repeat `[a, b] = [a ^ b, (a & b) << 1]` until `b` (the carry) is 0. Then `a` is the answer.
- Each round pushes the carry at least one bit further left, so it takes at most 32 iterations: O(1) time and space.
- Negatives just work in two's complement. In JS, `^`, `&` and `<<` all produce signed 32-bit results, so the carry eventually shifts out of bit 31 and the loop ends.
- In Python (unbounded ints) you need a `0xFFFFFFFF` mask and a final sign fix; in Java/C++ the fixed width does the job, just like JS here.
- Pitfall: hiding a `+` inside helpers like `Math.max` tricks or `reduce`. The point is to show you understand the carry.
- Follow-up: subtraction without `-`, using `a + (~b + 1)` (the two's-complement negation) built from the same adder.
