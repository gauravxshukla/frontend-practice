---
title: Cheapest Flights Within K Stops
type: dsa
difficulty: medium
topic: advanced-graphs
order: 6
neetcode: true
tags: [graphs, bellman-ford, shortest-path, dynamic-programming]
estimatedMinutes: 25
---

There are `n` cities labelled `0` to `n - 1`. Each entry `[from, to, price]` in `flights` is a one-way flight.

Return the cheapest total price to get from `src` to `dst` using **at most `k` stops** (a stop is an intermediate city, so at most `k + 1` flights). If no such route exists, return `-1`.

```js
function findCheapestPrice(n, flights, src, dst, k) // → number
```

## Examples

```text
Input:  n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],
        src = 0, dst = 3, k = 1
Output: 700
Explanation: 0 → 1 → 3 costs 700 with one stop. 0 → 1 → 2 → 3 costs 400 but needs two stops.

Input:  n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1
Output: 200

Input:  n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0
Output: 500
```

## Constraints

- 1 ≤ `n` ≤ 100
- 0 ≤ `flights.length` ≤ n · (n − 1) / 2
- 1 ≤ `price` ≤ 10⁴; no duplicate flights and no self-loops
- `0 ≤ src, dst, k < n`, `src ≠ dst`

## Notes

- **Identify:** cheapest path using at most k + 1 edges → Bellman-Ford limited to k + 1 rounds
- **Brute force:** DFS every route up to k stops and keep the cheapest, exponential
- **Insight:** round i of Bellman-Ford finds the cheapest cost using at most i flights; stop after k + 1 rounds
- **Steps:** prices[src] = 0; repeat k + 1 times: copy prices, relax every flight from the old copy into the new one
- **Complexity:** exponential → O(k·E) time, O(n) space
- **Pitfall:** relax from the previous round's copy, or one round can chain several flights and exceed k stops
- **Related:** Network Delay Time, Swim in Rising Water, Min Cost to Connect All Points
