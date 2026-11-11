---
title: Rotting Oranges
type: dsa
difficulty: medium
topic: graphs
order: 5
neetcode: true
tags: [graphs, grid, bfs, multi-source-bfs]
estimatedMinutes: 20
---

You get a grid where each cell is `0` (empty), `1` (a fresh orange) or `2` (a rotten orange). Every minute, each fresh orange that is directly up, down, left or right of a rotten orange turns rotten.

Return the number of minutes until no fresh orange remains. If some fresh orange can never rot, return `-1`. If there are no fresh oranges to begin with, the answer is `0`.

```js
function orangesRotting(grid) // → number
```

## Examples

```text
Input:  grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4

Input:  grid = [[2,1,1],[0,1,1],[1,0,1]]
Output: -1
Explanation: the orange in the bottom-left corner has no rotten neighbour, ever.

Input:  grid = [[0,2]]
Output: 0
```

## Constraints

- 1 ≤ rows, cols ≤ 10
- Each cell is `0`, `1`, or `2`

## Notes

- **Identify:** rot spreads one step per minute from every rotten orange → multi-source BFS by levels
- **Brute force:** simulate minute by minute, rescanning the whole grid each time, O((m·n)²)
- **Insight:** BFS from all rotten oranges at once; each BFS level is one minute
- **Steps:** count fresh, queue rotten; each round rot fresh neighbours and add a minute; at the end fresh must be 0
- **Complexity:** O((m·n)²) → O(m·n) time, O(m·n) space
- **Pitfall:** no fresh oranges at the start means 0 minutes; any fresh left unreachable means −1
- **Related:** Walls and Gates, Number of Islands, Binary Tree Level Order Traversal
