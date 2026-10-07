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

- **Key insight:** to stand on position `i` you came from `i - 1` (paying `cost[i - 1]`) or from `i - 2` (paying `cost[i - 2]`). Take the cheaper.
- **Recurrence:** `best(i) = min(best(i - 1) + cost[i - 1], best(i - 2) + cost[i - 2])`, with `best(0) = best(1) = 0` because you may start on either for free. The answer is `best(n)`.
- **Bottom-up table:** O(n) time, O(n) space.
- **Space optimisation:** only `best(i - 1)` and `best(i - 2)` are read, so two variables are enough. O(n) time, O(1) space.
- An equivalent formulation: `pay(i) = cost[i] + min(pay(i + 1), pay(i + 2))` filled right to left, answer `min(pay(0), pay(1))`.
- **Brute force:** recursively try both moves from both starting stairs. O(2ⁿ).
- Pitfall: the top is *past* the last stair, so the loop must run to `i = n`, not `n - 1`.
- Pitfall: forgetting that starting on stair 1 is free, which would add `cost[0]` to every path.
- Follow-up: also return the stairs you stepped on (keep a parent pointer per position and walk it back).
