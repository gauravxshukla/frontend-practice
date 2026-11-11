---
title: Trapping Rain Water
type: dsa
difficulty: hard
topic: two-pointers
order: 5
neetcode: true
tags: [arrays, two-pointers]
estimatedMinutes: 30
---

Given `height`, an array of non-negative bar heights (each bar has width 1), compute how much rain water is trapped between the bars.

```js
trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]); // 6
trap([4, 2, 0, 3, 2, 5]);                   // 9
```

## Notes

- **Identify:** "water trapped" between bars → each bar depends on the tallest bar to its left and right
- **Key formula:** water at i = min(maxLeft, maxRight) − height[i]
- **Brute force:** for each bar, scan both sides for the maxes, O(n²)
- **Better:** precompute maxLeft[] and maxRight[] arrays, O(n) time, O(n) space
- **Insight:** the smaller side's max sets the water level, so process that side with two pointers and no arrays
- **Steps:** pointers at both ends; move the side with the lower bar; update its max, add max − height
- **Complexity:** O(n²) → O(n) time, O(n) → O(1) space
- **Pitfall:** update the max before adding water, so the result never goes negative
- **Related:** Container With Most Water, Largest Rectangle in Histogram
