---
title: Max Area of Island
type: dsa
difficulty: medium
topic: graphs
order: 2
neetcode: true
tags: [graphs, grid, dfs, bfs]
estimatedMinutes: 15
---

You get a binary matrix `grid` where `1` is land and `0` is water. An island is a group of land cells connected **horizontally or vertically**. Its area is the number of cells in it.

Return the area of the largest island, or `0` if there is no land at all. You may modify `grid`.

```js
function maxAreaOfIsland(grid) // → number
```

## Examples

```text
Input:  grid = [
  [0,0,1,0,0],
  [1,1,1,0,0],
  [0,0,0,1,1],
  [0,0,0,1,0]
]
Output: 4
Explanation: the top island has 4 cells; the bottom-right one has 3.

Input:  grid = [[0,0,0],[0,0,0]]
Output: 0
```

## Constraints

- 1 ≤ rows, cols ≤ 50
- `grid[r][c]` is `0` or `1`

## Notes

- **Identify:** size of the largest connected land group → DFS that returns the area it sinks
- **Brute force:** BFS from every land cell with a fresh visited set, O((m·n)²)
- **Insight:** one DFS per island counts its cells while sinking them, so each cell is visited once
- **Steps:** scan cells; on land, area = DFS returning 1 + the four neighbours' areas; keep the max
- **Complexity:** O((m·n)²) → O(m·n) time, O(m·n) recursion depth worst case
- **Pitfall:** mark a cell before recursing, or neighbours count it twice
- **Related:** Number of Islands, Surrounded Regions, Pacific Atlantic Water Flow
