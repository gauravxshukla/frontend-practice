---
title: Pacific Atlantic Water Flow
type: dsa
difficulty: medium
topic: graphs
order: 6
neetcode: true
tags: [graphs, grid, dfs, bfs]
estimatedMinutes: 25
---

You get a matrix `heights` describing an island's elevation. The **Pacific** ocean touches the top and left edges of the matrix; the **Atlantic** touches the bottom and right edges.

Rain on a cell can flow to a neighbouring cell (up, down, left, right) whose height is **less than or equal** to the current one. Water on a border cell can flow straight into the ocean next to that border.

Return every cell `[r, c]` from which water can reach **both** oceans. The order of the cells does not matter.

```js
function pacificAtlantic(heights) // → number[][]
```

## Examples

```text
Input:  heights = [
  [1,2,2,3,5],
  [3,2,3,4,4],
  [2,4,5,3,1],
  [6,7,1,4,5],
  [5,1,1,2,4]
]
Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]

Input:  heights = [[1]]
Output: [[0,0]]
Explanation: a single cell borders all four edges, so it reaches both oceans.
```

## Constraints

- 1 ≤ rows, cols ≤ 200
- 0 ≤ `heights[r][c]` ≤ 10⁵

## Notes

- **Key insight:** reverse the flow. Instead of asking where water from each cell can go, start at each ocean's border and walk **uphill** (to neighbours with height ≥ current). Every cell you reach can drain into that ocean.
- Run one DFS/BFS seeded with all Pacific border cells (top row, left column) and one seeded with all Atlantic border cells (bottom row, right column), each with its own visited matrix.
- The answer is every cell marked in both matrices.
- O(rows · cols) time and space: each search visits each cell at most once.
- Brute-force baseline: from every cell, search downhill and check whether you touch both a Pacific and an Atlantic edge. O((rows · cols)²).
- Pitfall: the comparison is `>=` when climbing (equal heights let water flow both ways). Using `>` misses plateaus.
- Pitfall: corner cells belong to both oceans; a 1-row or 1-column grid puts every cell on both borders.
- Recursive DFS on a 200x200 grid can get deep; an explicit stack is safer.
- Follow-up: return the cells sorted, or count cells that reach exactly one ocean.
