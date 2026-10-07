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

- Water above bar `i` = `min(maxLeft[i], maxRight[i]) - height[i]`.
- **Prefix/suffix max arrays:** O(n) time, O(n) space. Easy to explain, so start here.
- **Two pointers:** O(1) space. Move the side with the **smaller** wall inward. That side's water is bounded by its own running max, because the other side is guaranteed to be at least as tall.
- Also solvable with a monotonic stack (it fills water layer by layer).
