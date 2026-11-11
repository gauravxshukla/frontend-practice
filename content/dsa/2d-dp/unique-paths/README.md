---
title: Unique Paths
type: dsa
difficulty: medium
topic: 2d-dp
order: 1
neetcode: true
tags: [dynamic-programming, grid, combinatorics]
estimatedMinutes: 15
---

A robot starts in the top-left cell of an `m × n` grid and wants to reach the bottom-right cell. On each move it goes either **one cell right** or **one cell down**. Return how many different routes exist.

```js
function uniquePaths(m, n) // → number
```

## Examples

```text
Input:  m = 3, n = 7
Output: 28

Input:  m = 3, n = 2
Output: 3
Explanation: Right-Down-Down, Down-Right-Down, Down-Down-Right.
```

## Constraints

- 1 ≤ `m`, `n` ≤ 100
- The answer is at most 2 · 10⁹

## Notes

- **Identify:** count right/down paths across a grid → grid DP, each cell from its top and left
- **Key formula:** paths[r][c] = paths[r − 1][c] + paths[r][c − 1]
- **Brute force:** recurse right and down from the start, O(2^(m+n))
- **Insight:** a row only needs the row above, so one array updated left to right holds everything
- **Steps:** row = all 1s (top row); for each next row, row[c] += row[c − 1]; answer is row[n − 1]
- **Complexity:** O(2^(m+n)) → O(m·n) time, O(n) space
- **Pitfall:** the first row and column each have exactly one path; 1 × 1 is 1
- **Related:** Longest Common Subsequence, Climbing Stairs, Edit Distance
