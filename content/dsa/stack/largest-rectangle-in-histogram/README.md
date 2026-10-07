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

- **Key insight:** the best rectangle has the height of some bar `i`, and extends left and right until it hits a shorter bar. So you need each bar's nearest smaller bar on both sides.
- **Monotonic stack (one pass):** keep indices with increasing heights. When bar `i` is shorter than the top, pop the top. Its right boundary is `i`, and its left boundary is the new top + 1 (or 0 if the stack is empty). Area = `height × (i − left)`.
- Run one extra iteration with height 0 at `i = n` to flush every remaining bar.
- O(n) time, because each index is pushed and popped once. O(n) space.
- **Alternative:** two passes to precompute `leftSmaller[]` and `rightSmaller[]` with a stack, then one pass for areas. Same complexity and easier to debug.
- **Baseline:** for each start, extend right while tracking the running minimum. O(n²), too slow for 10⁵ bars.
- Pitfall: the width when the stack becomes empty is the whole prefix `i`, not `i − top − 1`.
- Pitfall: forgetting the final flush loses rectangles that reach the right edge, as in `[1,2,3,4,5]`.
- Follow-up: "Maximal Rectangle" in a binary matrix runs this algorithm on each row's running column heights.
