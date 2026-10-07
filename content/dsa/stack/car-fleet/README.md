---
title: Car Fleet
type: dsa
difficulty: medium
topic: stack
order: 6
neetcode: true
tags: [stack, sorting, greedy, arrays]
estimatedMinutes: 25
---

`n` cars drive along a one-lane road toward the same destination at mile `target`. Car `i` starts at mile `position[i]` and drives at `speed[i]` miles per hour. All starting positions are different.

A car can never pass the car ahead of it. When it catches up, it slows down and the two travel together as a **fleet** at the slower speed. Cars that meet exactly at the destination also count as one fleet. A lone car is a fleet of one.

Return how many fleets arrive at the destination.

```js
function carFleet(target, position, speed) // → number
```

## Examples

```text
Input:  target = 10, position = [1,4], speed = [3,2]
Output: 1
Explanation: the car at 1 would arrive in 3h and the car at 4 in 3h, so they meet at the destination.

Input:  target = 10, position = [4,1,0,7], speed = [2,2,1,1]
Output: 3
Explanation: arrival times alone are 3, 4.5, 10, 3. The car at 4 catches the car at 7 and they form one fleet. The cars at 1 and 0 each arrive later on their own.
```

## Constraints

- 1 ≤ `n` ≤ 10⁵
- 0 < `target` ≤ 10⁶
- 0 ≤ `position[i]` < `target`, and all positions are distinct.
- 0 < `speed[i]` ≤ 10⁶

## Notes

- **Key insight:** process cars from the one closest to the target backwards. Compute each car's solo arrival time, `(target − position) / speed`.
- If a car's time is ≤ the time of the fleet directly ahead, it catches that fleet (and then moves at its pace), so it merges. Otherwise it arrives later and starts a new fleet, whose time becomes the new bar.
- O(n log n) for the sort, then an O(n) scan. O(n) space.
- The classic stack framing: push arrival times and pop (merge) when the new time is ≤ the top. The reference just keeps the top in one variable, since only the last fleet matters.
- **Baseline:** simulate hour by hour. It's complicated, slow, and suffers from floating-point issues.
- Pitfall: sorting by speed or by arrival time instead of by **position**.
- Pitfall: "meets exactly at the target" counts as merging, so use `≤` when comparing times. (Cross-multiplying avoids float noise if you're worried about it.)
- Follow-up: "Car Fleet II" asks for each car's collision time and needs a monotonic stack with time comparisons.
