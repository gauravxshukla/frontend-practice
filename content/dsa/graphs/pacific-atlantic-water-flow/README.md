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

- **Identify:** cells whose water can reach both oceans → reverse flow: DFS uphill from each ocean's border
- **Brute force:** from every cell, DFS downhill to see which oceans it reaches, O((m·n)²)
- **Insight:** instead of flowing down from each cell, climb up from the oceans; two DFS passes cover everything
- **Steps:** DFS from Pacific borders and Atlantic borders, moving to neighbours ≥ current height; return cells in both sets
- **Complexity:** O((m·n)²) → O(m·n) time, O(m·n) space
- **Pitfall:** climbing allows equal heights (≥), because water flows across flat cells
- **Related:** Surrounded Regions, Number of Islands, Walls and Gates
