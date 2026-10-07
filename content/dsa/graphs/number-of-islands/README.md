---
title: Number of Islands
type: dsa
difficulty: medium
topic: graphs
order: 1
neetcode: true
tags: [graphs, grid, dfs, bfs, union-find]
estimatedMinutes: 20
---

You get a 2-D map `grid` where each cell is the string `"1"` (land) or `"0"` (water). Land cells that touch **horizontally or vertically** belong to the same island; diagonal contact does not count. Everything outside the grid is water.

Return how many separate islands the map contains. You may modify `grid`.

```js
function numIslands(grid) // → number
```

## Examples

```text
Input:  grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1

Input:  grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
Explanation: a 2x2 block top-left, a single cell in the middle, and a pair bottom-right.
```

## Constraints

- 1 ≤ rows, cols ≤ 300
- `grid[r][c]` is `"0"` or `"1"` (strings, not numbers)

## Notes

- **Key insight:** each island is a connected component of land cells, so count how many times you have to start a fresh flood fill.
- Scan every cell. When you hit an unvisited `"1"`, increment the count and flood-fill (DFS or BFS) the whole island, marking each cell visited (overwriting it with `"0"` is the cheapest marker).
- O(rows · cols) time: every cell is visited a constant number of times. O(rows · cols) worst-case space for the stack/queue (a grid that is all land).
- Recursive DFS can blow the call stack on a 300x300 all-land grid; an explicit stack or BFS queue avoids that.
- Mark a cell visited **when you push it**, not when you pop it, or the same cell can enter the stack many times.
- Alternative: union-find over land cells, unioning each cell with its right and down neighbours; the answer is the number of distinct roots. Same complexity, handy when cells arrive one at a time.
- Pitfalls: comparing against the number `1` instead of the string `"1"`; counting diagonal neighbours; forgetting a 1x1 grid.
- Follow-up: "Number of Islands II", where land is added one cell at a time and you report the count after each addition (union-find shines here).
- Follow-up: count distinct island **shapes** by recording a normalized path signature of each flood fill.
