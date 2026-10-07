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

- **Key insight:** same as counting islands, but each flood fill also returns how many cells it sank; keep the running maximum.
- Scan the grid; on an unvisited `1`, flood-fill with a stack (or recursion), zeroing cells as you push them and counting each one popped.
- O(rows · cols) time and O(rows · cols) worst-case space for the stack.
- Brute-force baseline: for each land cell, run a fresh BFS with its own visited set. Correct but O((rows · cols)²).
- Pitfall: returning `-Infinity` or `undefined` for an all-water grid; the answer must be `0`.
- Pitfall: diagonal cells are **not** connected, so a checkerboard of land has max area 1.
- If you must not mutate the input, use a separate `visited` matrix.
- Follow-up: "Making a Large Island": flip at most one `0` to `1` and maximize the area (label islands with ids and sizes, then try each water cell).
