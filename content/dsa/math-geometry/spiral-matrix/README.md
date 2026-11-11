---
title: Spiral Matrix
type: dsa
difficulty: medium
topic: math-geometry
order: 2
neetcode: true
tags: [arrays, matrix, simulation]
estimatedMinutes: 20
---

You get an `m × n` matrix (an array of rows). Return all of its elements in **spiral order**: start at the top-left, go right along the top row, down the right column, left along the bottom row, up the left column, and keep spiralling inwards until every element has been visited once.

```js
function spiralOrder(matrix) // → number[]
```

## Examples

```text
Input:  matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]

Input:  matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]
```

## Constraints

- 1 ≤ m, n ≤ 10
- −100 ≤ `matrix[i][j]` ≤ 100

## Notes

- **Identify:** read a matrix in spiral order → shrink four boundaries (top, bottom, left, right)
- **Brute force:** walk with a direction and a visited grid, turning when blocked, O(m·n) extra space
- **Insight:** after each side is read, its boundary moves inward, so no visited grid is needed
- **Steps:** read top row, right column, bottom row (if rows remain), left column (if columns remain); shrink each bound
- **Complexity:** O(m·n) time either way; O(m·n) → O(1) extra space
- **Pitfall:** check top ≤ bottom and left ≤ right again before the bottom and left passes, or a single row/column repeats
- **Related:** Rotate Image, Set Matrix Zeroes, Valid Sudoku
