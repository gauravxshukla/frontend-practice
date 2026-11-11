---
title: Counting Bits
type: dsa
difficulty: easy
topic: bit-manipulation
order: 3
neetcode: true
tags: [bit-manipulation, dynamic-programming]
estimatedMinutes: 15
---

You get a non-negative integer `n`. Return an array `ans` of length `n + 1` where `ans[i]` is the number of `1` bits in the binary form of `i`, for every `i` from `0` to `n`.

Try to do it in O(n) total time, without counting each number's bits from scratch.

```js
function countBits(n) // → number[]
```

## Examples

```text
Input:  n = 2
Output: [0,1,1]

Input:  n = 5
Output: [0,1,1,2,1,2]
Explanation: 0→0, 1→1, 10→1, 11→2, 100→1, 101→2.
```

## Constraints

- 0 ≤ n ≤ 10⁵

## Notes

- **Identify:** set-bit counts for every number 0..n → DP reusing smaller numbers' counts
- **Key formula:** bits[i] = bits[i >> 1] + (i & 1)
- **Brute force:** count bits of each number separately, O(n log n)
- **Insight:** dropping the last bit gives a smaller number whose count is already known
- **Steps:** bits[0] = 0; for i = 1..n: bits[i] = bits[i >> 1] + (i & 1)
- **Complexity:** O(n log n) → O(n) time, O(n) space for the output
- **Pitfall:** the output has n + 1 entries, including 0
- **Related:** Number of 1 Bits, Climbing Stairs, Reverse Bits
