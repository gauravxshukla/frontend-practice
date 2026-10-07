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

- **Key insight:** the stop limit breaks plain Dijkstra (a cheaper route with more stops can block a pricier one with fewer). Bounding the number of **edges** is exactly what Bellman-Ford's rounds do.
- Bellman-Ford with `k + 1` rounds: `prices[src] = 0`, everything else `Infinity`. Each round, copy `prices` to `next` and relax every flight **reading from `prices`** and writing into `next`. After round `i`, `prices[v]` is the cheapest cost using at most `i` flights.
- O(k · E) time, O(n) space.
- Why the copy matters: relaxing in place lets one round chain several flights, quietly breaking the stop limit.
- Alternative: BFS level by level (one level per flight) with pruning when a cheaper cost to a city is already known for that level.
- Alternative: Dijkstra over states `(city, flightsUsed)`; correct because the state includes the stop count. O(E · k · log(E · k)).
- Pitfall: confusing stops with flights (`k` stops means `k + 1` flights).
- Edge cases: no flights at all, `dst` unreachable, `k = 0` (only direct flights).
- Follow-up: also return the route, or minimize stops first and price second.
