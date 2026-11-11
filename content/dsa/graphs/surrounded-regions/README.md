---
title: Surrounded Regions
type: dsa
difficulty: medium
topic: graphs
order: 7
neetcode: true
tags: [graphs, grid, dfs, bfs]
estimatedMinutes: 20
---

You get a board of `"X"` and `"O"` strings. A **region** is a group of `"O"` cells connected up, down, left or right. A region is *captured* when none of its cells lies on the board's edge; capture it by turning all of its `"O"`s into `"X"`.

Capture every surrounded region **in place**. Regions that touch the edge stay as they are. Return nothing.

```js
function solve(board) // → void (modify board)
```

## Examples

```text
Input:  board = [
  ["X","X","X","X"],
  ["X","O","O","X"],
  ["X","X","O","X"],
  ["X","O","X","X"]
]
Output: [
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","X","X","X"],
  ["X","O","X","X"]
]
Explanation: the three middle "O"s are enclosed and get captured. The bottom "O" sits on the edge, so it survives.

Input:  board = [["X"]]
Output: [["X"]]
```

## Constraints

- 1 ≤ rows, cols ≤ 200
- Each cell is `"X"` or `"O"`

## Notes

- **Identify:** capture "O" regions not touching the border → mark border-connected "O"s first (DFS)
- **Brute force:** for every "O" region, explore it to see if it touches the border, re-exploring shared cells
- **Insight:** instead of testing each region, DFS from border "O"s to mark the safe ones; everything else flips
- **Steps:** DFS from every border "O" marking it "S"; then flip remaining "O" → "X" and "S" → "O"
- **Complexity:** O((m·n)²) → O(m·n) time, O(m·n) recursion depth worst case
- **Pitfall:** do both passes after marking; flipping during the scan captures cells that are actually safe
- **Related:** Pacific Atlantic Water Flow, Number of Islands, Walls and Gates
