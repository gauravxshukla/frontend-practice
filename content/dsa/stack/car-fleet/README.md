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

- **Identify:** cars catch up and merge before the target → sort by position, compare arrival times
- **Key formula:** time to target = (target − position) / speed
- **Brute force:** simulate the cars moving step by step until all arrive
- **Insight:** going from the car nearest the target backwards, a car that would arrive sooner joins the fleet ahead
- **Steps:** sort by position descending; for each car's time, if it's greater than the last fleet's time, it starts a new fleet
- **Complexity:** simulation → O(n log n) time, O(n) space
- **Pitfall:** a car arriving at exactly the same time joins the fleet (use >, not ≥, for a new fleet)
- **Related:** Daily Temperatures, Largest Rectangle in Histogram, Merge Intervals
