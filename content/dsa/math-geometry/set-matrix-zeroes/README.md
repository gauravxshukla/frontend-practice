---
title: Set Matrix Zeroes
type: dsa
difficulty: medium
topic: math-geometry
order: 3
neetcode: true
tags: [arrays, matrix, hash-set, in-place]
estimatedMinutes: 20
---

You get an `m × n` integer matrix. Wherever a cell holds `0`, set that cell's **entire row and entire column** to `0`. Only zeros that were in the original matrix trigger this; zeros you write don't spread further.

Do it **in place**: change `matrix` itself. The return value is ignored, and the grader checks `matrix` after your function runs.

```js
function setZeroes(matrix) // → void (mutates matrix)
```

## Examples

```text
Input:  matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output (matrix after the call): [[1,0,1],[0,0,0],[1,0,1]]

Input:  matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output (matrix after the call): [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
```

## Constraints

- 1 ≤ m, n ≤ 200
- −2³¹ ≤ `matrix[i][j]` ≤ 2³¹ − 1

## Notes

- **Identify:** zero the full row and column of every 0 → record which rows/columns, then clear them
- **Brute force:** copy the matrix and zero rows/columns from the copy, O(m·n) extra space
- **Better:** a rows set and a cols set from a first pass, O(m + n) extra space
- **Insight:** use the first row and first column as those markers, with one flag for the first column itself
- **Steps:** mark matrix[r][0] and matrix[0][c] for zeros; zero inner cells from the marks; then the first row; then the first column
- **Complexity:** O(m·n) time; O(m·n) → O(1) extra space
- **Pitfall:** clear the first row and column last, or their markers wipe out real data too early
- **Related:** Rotate Image, Spiral Matrix, Valid Sudoku
