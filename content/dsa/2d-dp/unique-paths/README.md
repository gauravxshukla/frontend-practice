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

- **Key insight:** the last move into cell `(r, c)` comes from above or from the left, so the counts add.
- **Recurrence:** `paths(r, c) = paths(r - 1, c) + paths(r, c - 1)`, with `paths(0, c) = paths(r, 0) = 1` (a single straight line along the first row or column).
- **2-D table:** O(m · n) time and space.
- **Space optimisation:** a row only reads the row above and the cell to its left, so update one array in place with `row[c] += row[c - 1]`. O(m · n) time, O(n) space (use `min(m, n)` by swapping).
- **Combinatorics:** every route is a sequence of `m - 1` downs and `n - 1` rights, so the answer is `C(m + n - 2, m - 1)`. Compute it with a running product that divides as it goes to stay exact.
- **Brute force:** recursively branch right/down from the start. O(2^(m+n)).
- Edge cases: a `1 × n` or `m × 1` grid has exactly one route.
- Pitfall: computing the binomial with full factorials, which overflow long before `m = n = 100`.
- Follow-up: Unique Paths II adds obstacles. Set an obstacle cell's count to 0 and the same rolling row works.
