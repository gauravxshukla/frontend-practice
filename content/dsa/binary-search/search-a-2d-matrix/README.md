---
title: Search a 2D Matrix
type: dsa
difficulty: medium
topic: binary-search
order: 2
neetcode: true
tags: [arrays, matrix, binary-search]
estimatedMinutes: 15
---

You get an `m × n` grid of integers with two properties:

- each row is sorted in ascending order, and
- the first value of every row is larger than the last value of the row above it.

Return `true` if `target` appears anywhere in the grid, and `false` otherwise. Aim for O(log(m · n)) time.

```js
function searchMatrix(matrix, target) // → boolean
```

## Examples

```text
Input:  matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true

Input:  matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false
```

## Constraints

- 1 ≤ m, n ≤ 100
- −10⁴ ≤ `matrix[i][j]`, `target` ≤ 10⁴

## Notes

- **Key insight:** because rows chain together in order, reading the grid row by row gives one sorted array of `m · n` values.
- Binary search over virtual indices `0 … m·n − 1`, and map index `i` to `matrix[Math.floor(i / n)][i % n]`.
- O(log(m · n)) time, O(1) space. Brute force scans every cell in O(m · n).
- Alternative: binary search the first column to pick the row, then binary search inside that row. Same complexity, two loops to get right.
- Pitfall: dividing by the row count instead of the column count when converting the index.
- Edge cases: a single row, a single column, target smaller than everything or larger than everything.
- Follow-up: if rows and columns are sorted but rows don't chain (LeetCode 240), start from the top-right corner and walk left/down in O(m + n).
