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

- **Identify:** count connected groups of "1" cells on a grid → flood fill (DFS) from each unvisited land cell
- **Brute force:** for every land cell, BFS with a fresh visited set and dedupe islands, O((m·n)²)
- **Insight:** each new land cell found by the scan starts an island; sink it all so it's never counted again
- **Steps:** scan cells; on a "1", count++ and DFS turning connected "1"s to "0"
- **Complexity:** O((m·n)²) → O(m·n) time, O(m·n) recursion depth worst case
- **Pitfall:** only 4-directional neighbours count; diagonal land is a separate island
- **Related:** Max Area of Island, Surrounded Regions, Rotting Oranges
