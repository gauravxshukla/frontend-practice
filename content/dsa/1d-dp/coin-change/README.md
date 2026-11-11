---
title: Coin Change
type: dsa
difficulty: medium
topic: 1d-dp
order: 8
neetcode: true
tags: [dynamic-programming, bfs, knapsack]
estimatedMinutes: 25
---

You have unlimited coins of each denomination in `coins`. Return the **fewest coins** whose values add up to exactly `amount`, or `-1` if no combination reaches it. An `amount` of `0` needs `0` coins.

```js
function coinChange(coins, amount) // → number
```

## Examples

```text
Input:  coins = [1,2,5], amount = 11
Output: 3
Explanation: 5 + 5 + 1.

Input:  coins = [2], amount = 3
Output: -1
Explanation: Odd amounts cannot be made from 2s.

Input:  coins = [1], amount = 0
Output: 0
```

## Constraints

- 1 ≤ `coins.length` ≤ 12
- 1 ≤ `coins[i]` ≤ 2³¹ − 1
- 0 ≤ `amount` ≤ 10⁴

## Notes

- **Identify:** fewest coins to make an amount, unlimited coins → unbounded knapsack DP over amounts
- **Key formula:** dp[a] = min over coins c ≤ a of dp[a − c] + 1
- **Brute force:** try every combination of coins recursively, exponential
- **Insight:** the best for amount a reuses the best for a smaller amount, so fill amounts bottom-up once
- **Steps:** dp[0] = 0, others ∞; for a = 1..amount, for each coin ≤ a, dp[a] = min(dp[a], dp[a − c] + 1)
- **Complexity:** exponential → O(amount · coins) time, O(amount) space
- **Pitfall:** greedy (largest coin first) fails, e.g. [1, 3, 4] for 6; unreachable amounts return −1
- **Related:** Coin Change II, Climbing Stairs, Partition Equal Subset Sum
