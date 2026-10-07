---
title: Longest Increasing Path in a Matrix
type: dsa
difficulty: hard
topic: 2d-dp
order: 7
neetcode: true
tags: [dynamic-programming, dfs, memoization, topological-sort, grid]
estimatedMinutes: 30
---

Given an `m × n` grid of integers, return the length (number of cells) of the longest path in which every step moves **up, down, left or right** to a neighbouring cell with a **strictly larger** value. Diagonal moves and wrapping around the edges are not allowed.

```js
function longestIncreasingPath(matrix) // → number
```

## Examples

```text
Input:  matrix = [[9,9,4],[6,6,8],[2,1,1]]
Output: 4
Explanation: One longest path is 1 → 2 → 6 → 9.

Input:  matrix = [[3,4,5],[3,2,6],[2,2,1]]
Output: 4
Explanation: 3 → 4 → 5 → 6.
```

## Constraints

- 1 ≤ `m`, `n` ≤ 200
- 0 ≤ `matrix[i][j]` ≤ 2³¹ − 1

## Notes

- **Key insight:** because values must strictly increase, a path can never revisit a cell. The "can move to" relation is a DAG, so the longest path from a cell does not depend on how you got there, and it can be cached.
- **Recurrence:** `best(r, c) = 1 + max(best(nr, nc))` over the 4 neighbours with `matrix[nr][nc] > matrix[r][c]`, or `1` if there are none. The answer is the max over all cells.
- **Memoised DFS:** each cell is computed once and looks at 4 neighbours. O(m · n) time, O(m · n) space for the cache plus recursion depth up to `m · n` on a snake-shaped path.
- No `visited` set is needed. The strict increase already prevents cycles.
- **Alternative, topological peeling (Kahn):** start from cells with no larger neighbour (out-degree 0) and peel them layer by layer. The number of layers is the answer. This is iterative, so there is no deep recursion.
- No meaningful space reduction exists. Every cell's value can be needed later, so the O(m · n) table stays.
- **Brute force:** DFS from every cell without caching. Exponential on grids with many branching increasing paths.
- Edge cases: a single cell → 1, all-equal values → 1, a fully sorted spiral → m · n.
- Pitfall: using `>=` instead of `>` creates cycles between equal neighbours and infinite recursion.
