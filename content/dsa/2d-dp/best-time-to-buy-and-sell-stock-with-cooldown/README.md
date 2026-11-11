---
title: Best Time to Buy and Sell Stock with Cooldown
type: dsa
difficulty: medium
topic: 2d-dp
order: 3
neetcode: true
tags: [dynamic-programming, state-machine, arrays]
estimatedMinutes: 25
---

`prices[i]` is a stock's price on day `i`. You may complete as many buy-then-sell trades as you like, with two rules: you can hold **at most one share** at a time, and after you sell you must **wait one full day** (a cooldown) before buying again. Return the maximum total profit.

```js
function maxProfit(prices) // → number
```

## Examples

```text
Input:  prices = [1,2,3,0,2]
Output: 3
Explanation: buy, sell, cooldown, buy, sell: (2 - 1) + (2 - 0) = 3.

Input:  prices = [1]
Output: 0
```

## Constraints

- 1 ≤ `prices.length` ≤ 5000
- 0 ≤ `prices[i]` ≤ 1000

## Notes

- **Identify:** unlimited trades with a one-day cooldown after selling → state-machine DP per day
- **Brute force:** recurse on buy / sell / wait every day, O(3^n)
- **Better:** memoise (day, holding) top-down, O(n) time, O(n) space
- **Insight:** each day you're in one of three states: holding, just sold, or resting; three numbers carry all history
- **Steps:** hold = max(hold, rest − price); sold = hold + price; rest = max(rest, sold); answer max(sold, rest)
- **Complexity:** O(3^n) → O(n) time, O(1) space
- **Pitfall:** compute the new states from yesterday's values, or a buy and sell can happen on one day
- **Related:** Best Time to Buy and Sell Stock, House Robber, Coin Change II
