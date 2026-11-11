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

- **Identify:** starting station for a full loop → total gas check + reset the start when the tank goes negative
- **Brute force:** simulate the loop from every station, O(n²)
- **Insight:** if you run dry going from a to b, no station between them can be the start either, so jump past b
- **Steps:** if Σgas < Σcost return −1; tank = 0; for each i: tank += gas − cost; if tank < 0, start = i + 1, tank = 0
- **Complexity:** O(n²) → O(n) time, O(1) space
- **Pitfall:** the total check is what guarantees the found start completes the wrap-around
- **Related:** Jump Game, Maximum Subarray, Jump Game II
