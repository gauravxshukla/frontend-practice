---
title: Gas Station
type: dsa
difficulty: medium
topic: greedy
order: 4
neetcode: true
tags: [arrays, greedy, prefix-sum]
estimatedMinutes: 20
---

There are `n` gas stations arranged in a circle. Station `i` gives you `gas[i]` units of fuel, and driving from station `i` to station `i + 1` (wrapping to 0 after the last one) burns `cost[i]` units.

Your car starts with an empty tank at a station of your choice. Return the index of the station where you can start and drive the full loop once, clockwise, without the tank ever going negative. Return `-1` if no such station exists. When an answer exists it is unique.

```js
function canCompleteCircuit(gas, cost) // → number
```

## Examples

```text
Input:  gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
Explanation: Start at 3 with 4 fuel: 4-1+5=8, 8-2+1=7, 7-3+2=6, 6-4+3=5, 5-5=0. You make it back.

Input:  gas = [2,3,4], cost = [3,4,3]
Output: -1
Explanation: Total gas (9) is less than total cost (10), so no start works.
```

## Constraints

- 1 ≤ n ≤ 10⁵
- `gas.length === cost.length === n`
- 0 ≤ `gas[i]`, `cost[i]` ≤ 10⁴

## Notes

- **Key insight 1:** if `sum(gas) < sum(cost)` no start can work. If `sum(gas) ≥ sum(cost)` some start always works.
- **Key insight 2:** if you start at `s` and run dry arriving at `i + 1`, then no station between `s` and `i` can be the answer either. Each of them would arrive at `i + 1` with even less fuel, since everything before it contributed a non-negative amount.
- So sweep once: keep a running `tank`. When it goes negative, reset it to 0 and set `start = i + 1`. Track `total` separately for the feasibility check.
- O(n) time, O(1) space.
- Brute force: simulate a full loop from every start, O(n²).
- Pitfall: checking `tank < 0` against the full total instead of resetting it, or forgetting the global `total ≥ 0` check at the end.
- Edge case: one station works exactly when `gas[0] ≥ cost[0]`.
- Follow-up: explain why the uniqueness guarantee matters. Without it there may be several valid starts, and the greedy returns the first one in its sweep.
