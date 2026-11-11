---
title: Coin Change II
type: dsa
difficulty: medium
topic: 2d-dp
order: 4
neetcode: true
tags: [dynamic-programming, knapsack, combinatorics]
estimatedMinutes: 25
---

You have unlimited coins of each denomination in `coins`. Return the number of **different combinations** of coins that add up to exactly `amount`. Order does not matter: `1 + 2` and `2 + 1` are the same combination. An `amount` of `0` has exactly one combination (use no coins), and if nothing works return `0`.

```js
function change(amount, coins) // → number
```

## Examples

```text
Input:  amount = 5, coins = [1,2,5]
Output: 4
Explanation: 5, 2+2+1, 2+1+1+1, 1+1+1+1+1.

Input:  amount = 3, coins = [2]
Output: 0

Input:  amount = 10, coins = [10]
Output: 1
```

## Constraints

- 1 ≤ `coins.length` ≤ 300
- 1 ≤ `coins[i]` ≤ 5000, and all denominations are distinct
- 0 ≤ `amount` ≤ 5000
- The answer fits in a signed 32-bit integer

## Notes

- **Identify:** number of coin combinations (order doesn't matter) for an amount → unbounded knapsack counting
- **Key formula:** ways[a] += ways[a − coin], coins in the outer loop
- **Brute force:** recurse over coins with a start index, exponential
- **Insight:** looping coins outside amounts counts each combination once, in coin order, never as permutations
- **Steps:** ways[0] = 1; for each coin, for a = coin..amount: ways[a] += ways[a − coin]
- **Complexity:** exponential → O(coins · amount) time, O(amount) space
- **Pitfall:** amounts in the outer loop count orderings (1+2 and 2+1) separately
- **Related:** Coin Change, Target Sum, Partition Equal Subset Sum
