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

- **Two pointers (optimal):** start with the widest pair (`0`, `n - 1`). Record the area, then move the pointer at the **shorter** wall inward.
- Why that's correct: the shorter wall caps the area. Pairing it with any wall closer in can only shrink the width without raising the cap, so it can never beat the area just recorded. It's safe to discard.
- O(n) time and O(1) space.
- **Baseline:** try every pair for O(n²), which is too slow for 10⁵ walls.
- Pitfall: moving the taller wall, or both walls, can skip the optimal pair.
- Pitfall: when the heights are equal, moving either one is fine, since neither can be part of a better pair with the other.
- Don't confuse this with Trapping Rain Water, which sums water over every bar. Here only two walls matter.
- Follow-up: prove the greedy step formally (an exchange argument), since interviewers often ask "why is it safe to move the shorter side?"
