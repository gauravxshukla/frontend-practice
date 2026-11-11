---
title: Container With Most Water
type: dsa
difficulty: medium
topic: two-pointers
order: 4
neetcode: true
tags: [arrays, two-pointers, greedy]
estimatedMinutes: 20
---

You get an array `height`, where `height[i]` is a vertical wall standing at x-position `i`. Pick two walls. Together with the x-axis they hold water whose area is `(distance between them) × (height of the shorter wall)`. Return the largest area you can get.

```js
function maxArea(height) // → number
```

## Examples

```text
Input:  height = [1,7,2,5,4,7,3,6]
Output: 36
Explanation: walls at index 1 (7) and index 7 (6): width 6 × height 6.

Input:  height = [2,2,2]
Output: 4
```

## Constraints

- 2 ≤ `height.length` ≤ 10⁵
- 0 ≤ `height[i]` ≤ 10⁴

## Notes

- **Identify:** pick two lines to hold the most water → two pointers from the widest pair
- **Key formula:** area = min(height[l], height[r]) × (r − l)
- **Brute force:** try every pair of lines, O(n²)
- **Insight:** the shorter line caps the area, so move it inward; moving the taller one can only lose width
- **Steps:** l = 0, r = n − 1; record the area; move whichever side is shorter; repeat until they meet
- **Complexity:** O(n²) → O(n) time, O(1) space
- **Pitfall:** moving the taller line is the classic mistake; it never finds a bigger area
- **Related:** Trapping Rain Water, Two Sum II, 3Sum
