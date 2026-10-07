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

- **Key insight:** to avoid counting orderings, decide coin types one at a time. A combination either uses no more of coin `i` or uses at least one more.
- **Recurrence:** `ways(i, 0) = 1`, `ways(0, a > 0) = 0`, and `ways(i, a) = ways(i - 1, a) + ways(i, a - coins[i - 1])` (the second term only when `a ≥ coins[i - 1]`). It stays on row `i` because the coin can be reused.
- **2-D table:** O(n · amount) time and space.
- **Space optimisation:** row `i` reads row `i - 1` at the same column and itself to the left, so one array swept **upward** in `a` works. O(n · amount) time, O(amount) space.
- **Loop order matters:** coins outside and amounts inside counts combinations. Swapping the loops counts ordered sequences (Combination Sum IV), so `[1, 2]` would be counted twice.
- **Brute force:** recursion over `(coin index, remaining)` choosing how many of the current coin to take. Exponential without memoisation.
- Edge cases: `amount = 0` → 1 even with unusable coins; no coin divides the amount → 0.
- Pitfall: sweeping `a` downward turns it into 0/1 knapsack (each coin used at most once).
