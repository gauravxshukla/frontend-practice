---
title: Daily Temperatures
type: dsa
difficulty: medium
topic: stack
order: 5
neetcode: true
tags: [stack, monotonic-stack, arrays]
estimatedMinutes: 20
---

You get an array `temperatures`, one reading per day. For each day, return how many days you must wait until a **strictly warmer** day. If no warmer day comes later, use `0` for that day.

```js
function dailyTemperatures(temperatures) // → number[]
```

## Examples

```text
Input:  temperatures = [30,38,30,36,35,40,28]
Output: [1,4,1,2,1,0,0]
Explanation: day 1 (38) waits until day 5 (40), 4 days later.

Input:  temperatures = [22,21,20]
Output: [0,0,0]
```

## Constraints

- 1 ≤ `temperatures.length` ≤ 10⁵
- 30 ≤ `temperatures[i]` ≤ 100

## Notes

- **Monotonic stack:** keep a stack of indices still waiting for a warmer day. Their temperatures are non-increasing from bottom to top.
- For each day `i`, pop every index `j` whose temperature is lower than today's and set `answer[j] = i − j`. Then push `i`.
- Indices left on the stack at the end never found a warmer day and stay 0.
- O(n) time, because each index is pushed and popped once. O(n) space.
- **Baseline:** for each day, scan forward for the first warmer day. O(n²) on a decreasing input.
- Pitfall: use strict `<` when popping. Equal temperatures are *not* warmer.
- Pitfall: store indices, not temperatures, since you need the distance.
- **Alternative:** iterate right to left and jump using answers already computed (`j += answer[j]`). That's O(n) amortized with O(1) extra space.
- Follow-up: "Next Greater Element I/II" (the circular array version iterates twice).
