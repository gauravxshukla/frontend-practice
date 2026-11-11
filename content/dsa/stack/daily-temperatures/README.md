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

- **Identify:** "next greater element" for every day → monotonic decreasing stack of indices
- **Brute force:** for each day, scan forward for a warmer one, O(n²)
- **Insight:** instead of scanning forward, keep unresolved days on a stack; a warmer day resolves them
- **Steps:** for each day i, while it's warmer than the stack top, pop j and set answer[j] = i − j; push i
- **Complexity:** O(n²) → O(n) time, O(n) space
- **Pitfall:** equal temperatures aren't warmer: use a strict >, and days never resolved stay 0
- **Related:** Car Fleet, Largest Rectangle in Histogram, Sliding Window Maximum
