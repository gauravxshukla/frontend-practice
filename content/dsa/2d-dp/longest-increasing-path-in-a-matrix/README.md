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

- **Identify:** longest strictly increasing path moving in 4 directions → DFS + memo (DAG longest path)
- **Brute force:** DFS from every cell without memo, exponential in the worst case
- **Insight:** strictly increasing moves can't cycle, so each cell's best path is fixed: compute once, cache it
- **Steps:** best(r, c) = 1 + max best(neighbour) over larger neighbours; memoise; answer is max over cells
- **Complexity:** exponential → O(m·n) time, O(m·n) space
- **Pitfall:** equal neighbours don't count (strictly increasing), and no visited set is needed
- **Related:** Longest Increasing Subsequence, Number of Islands, Pacific Atlantic Water Flow
