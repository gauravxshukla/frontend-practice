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

- **Key insight:** the time needed for a path is the **highest** elevation on it. You want the path whose maximum is smallest, a "minimax" path.
- Modified Dijkstra: a min-heap keyed by "max elevation so far". Start with `[grid[0][0], 0, 0]`; pop the smallest, and push each unvisited neighbour with `max(current, neighbour)`. The first time you pop the target, that key is the answer.
- O(n² log n) time, O(n²) space.
- Binary search alternative: for a candidate `t`, BFS/DFS over cells with elevation ≤ `t` and check whether the target is reachable. Binary search `t` in `[0, n² - 1]`. O(n² log n) as well.
- Union-find alternative: add cells in increasing elevation order and stop once the two corners share a root.
- Pitfall: the start cell's own elevation counts; with `grid[0][0] = 3` you cannot leave before `t = 3`.
- Pitfall: summing elevations along the path, as in a normal shortest path, solves a different problem.
- Edge case: `n = 1`, where the answer is `grid[0][0]`.
- Follow-up: "Path With Minimum Effort", where the cost is the maximum height *difference* between steps (same minimax Dijkstra).
