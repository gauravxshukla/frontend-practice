---
title: Swim in Rising Water
type: dsa
difficulty: hard
topic: advanced-graphs
order: 4
neetcode: true
tags: [graphs, dijkstra, heap, binary-search, grid]
estimatedMinutes: 30
---

You get an `n x n` grid where `grid[r][c]` is the elevation of that cell. The values are a permutation of `0` to `n² - 1` (all distinct).

Rain starts at time `0`, and at time `t` the water everywhere is at depth `t`. You can swim from a cell to an adjacent cell (up, down, left, right) only if **both** elevations are at most `t`. Swimming itself takes no time.

Starting at the top-left cell `(0, 0)`, return the earliest time `t` at which you can reach the bottom-right cell `(n - 1, n - 1)`.

```js
function swimInWater(grid) // → number
```

## Examples

```text
Input:  grid = [[0,2],[1,3]]
Output: 3
Explanation: the target cell has elevation 3, so nothing is possible before t = 3.

Input:  grid = [
  [ 0, 1, 2, 3, 4],
  [24,23,22,21, 5],
  [12,13,14,15,16],
  [11,17,18,19,20],
  [10, 9, 8, 7, 6]
]
Output: 16
Explanation: follow the outer spiral; the highest cell on the best route is 16.
```

## Constraints

- 1 ≤ `n` ≤ 50
- `grid` contains each value from `0` to `n² - 1` exactly once

## Notes

- **Identify:** minimise the highest cell on a path from corner to corner → Dijkstra on the path's max elevation
- **Brute force:** binary search the time t and BFS cells ≤ t, O(n² log n²) (a valid alternative)
- **Insight:** always extend the path through the lowest reachable cell; the first time you pop the target, its max is optimal
- **Steps:** min-heap of (max so far, r, c) from (0, 0); pop; at the target return; push unvisited neighbours with max(t, height)
- **Complexity:** O(n² log n) time, O(n²) space
- **Pitfall:** the start cell's own height counts: begin with grid[0][0], not 0
- **Related:** Network Delay Time, Min Cost to Connect All Points, Cheapest Flights Within K Stops
