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

- **Identify:** ways to reach step n taking 1 or 2 steps → each step's count depends on the two before (DP)
- **Key formula:** ways(i) = ways(i − 1) + ways(i − 2)
- **Brute force:** recurse on both choices from every step, O(2^n)
- **Better:** memoise the recursion or fill a dp array, O(n) time, O(n) space
- **Insight:** only the last two counts are ever needed, so keep two variables instead of an array
- **Steps:** a = 1, b = 1 (ways to reach steps 0 and 1); repeat n − 1 times: a, b = b, a + b; return b
- **Complexity:** O(2^n) → O(n) time, O(n) → O(1) space
- **Pitfall:** n = 1 has exactly one way; start the pair at (1, 1), not (0, 1)
- **Related:** Min Cost Climbing Stairs, House Robber, Decode Ways
