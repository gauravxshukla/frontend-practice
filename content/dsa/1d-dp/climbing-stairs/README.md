---
title: Climbing Stairs
type: dsa
difficulty: easy
topic: 1d-dp
order: 1
neetcode: true
tags: [dynamic-programming, fibonacci, recursion, memoization]
estimatedMinutes: 10
---

A staircase has `n` steps. Each move you climb either **1** or **2** steps. Return how many **distinct sequences of moves** take you from the bottom (step 0) to exactly step `n`.

```js
function climbStairs(n) // → number
```

## Examples

```text
Input:  n = 2
Output: 2
Explanation: 1+1 or 2.

Input:  n = 3
Output: 3
Explanation: 1+1+1, 1+2, or 2+1.
```

## Constraints

- 1 ≤ `n` ≤ 45 (the answer fits comfortably in a 32-bit integer)

## Notes

- **Key insight:** the final move onto step `n` is either a 1-step from `n - 1` or a 2-step from `n - 2`, and those two groups never overlap.
- **Recurrence:** `ways(i) = ways(i - 1) + ways(i - 2)`, with `ways(0) = 1` (the empty sequence) and `ways(1) = 1`. This is the Fibonacci sequence shifted by one.
- **Bottom-up:** fill `dp[0..n]` left to right. O(n) time, O(n) space.
- **Space optimisation:** each value only reads the two before it, so keep two rolling variables. O(n) time, O(1) space.
- **Brute force:** plain recursion `ways(n - 1) + ways(n - 2)` without memoisation recomputes the same subproblems and grows as O(φⁿ) ≈ O(1.618ⁿ). It is already painfully slow at `n = 45`.
- **Memoised recursion** (top-down) fixes that with a cache, at the cost of O(n) stack depth.
- Pitfalls: getting the base cases off by one (`ways(2)` must be 2: `1+1` and `2`), and returning `twoBack` instead of `oneBack` after the loop.
- Follow-up: allowed step sizes come from a set `{1, 3, 5}`: the recurrence becomes `ways(i) = Σ ways(i - s)` over the step sizes.
- Follow-up: for huge `n` modulo a prime, use 2×2 matrix exponentiation for O(log n).
