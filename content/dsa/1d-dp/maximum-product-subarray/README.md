---
title: Maximum Product Subarray
type: dsa
difficulty: medium
topic: 1d-dp
order: 9
neetcode: true
tags: [arrays, dynamic-programming]
estimatedMinutes: 20
---

Given a non-empty integer array, return the largest product of any **contiguous**, non-empty subarray.

```js
maxProduct([2, 3, -2, 4]);  // 6  ([2, 3])
maxProduct([-2, 0, -1]);    // 0
maxProduct([-2, 3, -4]);    // 24 (the whole array)
```

## Notes

- **Identify:** largest product of a contiguous subarray, with negatives and zeros → track both max and min
- **Brute force:** multiply out every subarray, O(n²)
- **Insight:** a negative number swaps the biggest and smallest products, so keep both ending at each index
- **Steps:** for each n: candidates n, n × max, n × min; new max/min from them; update the best
- **Complexity:** O(n²) → O(n) time, O(1) space
- **Pitfall:** compute the new max and min from the old values together, before overwriting either
- **Related:** Maximum Subarray, House Robber, Product of Array Except Self
