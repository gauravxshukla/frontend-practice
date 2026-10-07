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

- **Key insight:** it is easier to find the regions that **escape** than the ones that are trapped. Anything connected to the border is safe; everything else is captured.
- Pass 1: from every border `"O"`, flood-fill and mark its whole region with a temporary marker such as `"S"`.
- Pass 2: scan the board. Any `"O"` left is surrounded, so flip it to `"X"`. Turn every `"S"` back into `"O"`.
- O(rows · cols) time; O(rows · cols) worst-case space for the flood-fill stack.
- Brute-force baseline: flood-fill each region from inside, record whether it touched the border, then flip it if not. Also O(rows · cols), but more bookkeeping.
- Pitfall: flipping cells during the first scan before you know whether their region reaches the edge.
- Pitfall: diagonal connections do not count, so an `"O"` touching a border `"O"` only diagonally is still captured.
- Edge cases: a 1xN or Nx1 board (everything is on the border), a board of only `"O"`.
- Follow-up: union-find variant, joining every border `"O"` to a virtual "outside" node.
