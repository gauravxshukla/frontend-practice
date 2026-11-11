---
title: Min Cost Climbing Stairs
type: dsa
difficulty: easy
topic: 1d-dp
order: 2
neetcode: true
tags: [dynamic-programming, arrays]
estimatedMinutes: 15
---

`cost[i]` is the price you pay when you step **off** stair `i`; after paying you may climb 1 or 2 stairs. You may begin on stair `0` or stair `1` for free. The top is the position just past the last stair (index `cost.length`). Return the **minimum total cost** to reach the top.

```js
function minCostClimbingStairs(cost) // → number
```

## Examples

```text
Input:  cost = [10,15,20]
Output: 15
Explanation: Start on stair 1, pay 15 and climb 2 to the top.

Input:  cost = [1,100,1,1,1,100,1,1,100,1]
Output: 6
Explanation: Step on stairs 0, 2, 4, 6, 7, 9 and pay 1 each.
```

## Constraints

- 2 ≤ `cost.length` ≤ 1000
- 0 ≤ `cost[i]` ≤ 999

## Notes

- **Identify:** cheapest way to the top paying cost[i] to leave step i, moving 1 or 2 → DP on steps
- **Key formula:** reach(i) = min(reach(i − 1) + cost[i − 1], reach(i − 2) + cost[i − 2])
- **Brute force:** try every sequence of 1- and 2-steps, O(2^n)
- **Insight:** the cheapest way to each step only needs the two steps below it, so keep two numbers
- **Steps:** reach(0) = reach(1) = 0; roll forward to reach(n), the top beyond the last step
- **Complexity:** O(2^n) → O(n) time, O(1) space
- **Pitfall:** the top is one past the last index, and you may start on step 0 or 1 for free
- **Related:** Climbing Stairs, House Robber, Coin Change
