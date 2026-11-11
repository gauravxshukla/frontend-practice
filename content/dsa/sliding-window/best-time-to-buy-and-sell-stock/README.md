---
title: Best Time to Buy and Sell Stock
type: dsa
difficulty: easy
topic: sliding-window
order: 1
neetcode: true
tags: [arrays, greedy]
estimatedMinutes: 10
---

`prices[i]` is the stock price on day `i`. Buy on one day and sell on a **later** day. Return the maximum profit, or `0` if no profit is possible.

```js
maxProfit([7, 1, 5, 3, 6, 4]); // 5 (buy at 1, sell at 6)
maxProfit([7, 6, 4, 3, 1]);    // 0
```

## Notes

- **Identify:** one buy before one sell, maximise the difference → track the cheapest price so far
- **Brute force:** try every buy day with every later sell day, O(n²)
- **Insight:** instead of pairing days, keep the lowest price seen; today's best profit is price − that low
- **Steps:** for each price, update the running minimum, then the best profit as price − minimum
- **Complexity:** O(n²) → O(n) time, O(1) space
- **Pitfall:** profit can't go negative: falling prices, empty or single-day input all return 0
- **Related:** Maximum Subarray, Best Time to Buy and Sell Stock with Cooldown, Sliding Window Maximum
