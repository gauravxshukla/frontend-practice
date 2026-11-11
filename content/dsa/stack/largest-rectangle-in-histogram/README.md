---
title: Largest Rectangle in Histogram
type: dsa
difficulty: hard
topic: stack
order: 7
neetcode: true
tags: [stack, monotonic-stack, arrays]
estimatedMinutes: 40
---

You get an array `heights` describing a histogram. Each bar has width 1 and height `heights[i]`, and the bars stand side by side. Return the area of the **largest axis-aligned rectangle** that fits entirely inside the histogram.

```js
function largestRectangleArea(heights) // → number
```

## Examples

```text
Input:  heights = [7,1,7,2,2,4]
Output: 8
Explanation: the last four bars [7,2,2,4] all reach height 2, so 2 × 4 = 8.

Input:  heights = [1,3,7]
Output: 7
Explanation: the single bar of height 7.
```

## Constraints

- 1 ≤ `heights.length` ≤ 10⁵
- 0 ≤ `heights[i]` ≤ 10⁴

## Notes

- **Identify:** largest rectangle under bars → for each bar, how far it extends left and right
- **Key formula:** area = height[i] × (right boundary − left boundary − 1)
- **Brute force:** for each bar, expand both ways while bars are at least as tall, O(n²)
- **Insight:** keep a stack of increasing heights; a shorter bar ends every taller bar on the stack
- **Steps:** for each i (plus a 0 sentinel at the end), pop taller bars; width = i − new top − 1; push i
- **Complexity:** O(n²) → O(n) time, O(n) space
- **Pitfall:** without the 0-height sentinel, bars still on the stack at the end are never measured
- **Related:** Daily Temperatures, Trapping Rain Water, Car Fleet
