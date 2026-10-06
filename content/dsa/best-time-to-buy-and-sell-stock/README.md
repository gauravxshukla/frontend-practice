---
title: Best Time to Buy and Sell Stock
type: dsa
difficulty: easy
tags: [arrays, greedy, blind75]
estimatedMinutes: 10
---

`prices[i]` is the stock price on day `i`. Buy on one day and sell on a **later** day. Return the maximum profit, or `0` if no profit is possible.

```js
maxProfit([7, 1, 5, 3, 6, 4]); // 5 (buy at 1, sell at 6)
maxProfit([7, 6, 4, 3, 1]);    // 0
```

## Notes

- Track the lowest price so far, and at each day compute `price - minSoFar`. One pass, O(1) space.
- This is Kadane's algorithm in disguise: max subarray over the daily price differences.
