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

- **Key insight:** the last coin used is one of `coins`. Whatever it is, the rest must be an optimal answer for `amount - coin`.
- **Recurrence:** `fewest(0) = 0`, `fewest(a) = 1 + min(fewest(a - c))` over coins `c ≤ a`, and `Infinity` when no coin fits. Report `-1` for `Infinity`.
- **Bottom-up:** fill `fewest[0..amount]`. O(amount · coins) time, O(amount) space. The table is already one-dimensional, so there is nothing further to squeeze.
- **BFS view:** amounts are nodes, coins are edges, and the answer is the shortest path from `0` to `amount`. Same complexity, and it stops early.
- **Brute force:** recursively try every coin at every step. Exponential in `amount / min(coin)`.
- **Greedy (largest coin first) is wrong:** `coins = [1, 3, 4], amount = 6` gives `4 + 1 + 1` (3 coins) but `3 + 3` uses 2.
- Edge cases: `amount = 0` → 0, no coin small enough → -1, a single coin that does not divide the amount → -1.
- Pitfall: initialising with `amount + 1` is fine as a sentinel, but `Number.MAX_SAFE_INTEGER + 1` overflows into wrong comparisons.
- Follow-up: count the number of combinations instead (Coin Change II), where loop order matters.
