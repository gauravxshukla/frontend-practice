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

- **Key insight:** model each day's end as one of three states. `hold` (own a share), `sold` (just sold today, so tomorrow is blocked), and `rest` (no share and allowed to buy).
- **Recurrences:** `hold[i] = max(hold[i - 1], rest[i - 1] - p)`, `sold[i] = hold[i - 1] + p`, `rest[i] = max(rest[i - 1], sold[i - 1])`. Start with `hold = -∞`, `sold = rest = 0`. The answer is `max(sold, rest)` on the last day.
- Equivalently with two states and an index: `buy(i) = max(buy(i - 1), sell(i - 2) - p)`. The `i - 2` is the cooldown.
- **Space optimisation:** each day reads only the previous day, so three scalars suffice (save `sold` before overwriting it). O(n) time, O(1) space.
- **Brute force:** recursion over `(day, holding)` trying buy/sell/skip without caching. O(2ⁿ). Memoising on `(day, holding)` gives O(n) states.
- Pitfall: allowing `hold` to come from `sold` of the previous day. That is exactly the purchase the cooldown forbids.
- Edge cases: one day → 0, strictly falling prices → 0, a sell-then-immediately-rebuy opportunity that must be skipped.
- Follow-ups: the same state machine handles a transaction fee (subtract it on sell) or at most `k` transactions (add a count dimension).
