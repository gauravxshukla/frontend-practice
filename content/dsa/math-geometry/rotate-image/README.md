---
title: Rotate Image
type: dsa
difficulty: medium
topic: math-geometry
order: 1
neetcode: true
tags: [arrays, matrix, math, in-place]
estimatedMinutes: 20
---

You get an `n × n` matrix (an array of rows). Rotate it **90 degrees clockwise, in place**: change `matrix` itself instead of building and returning a new one. The function's return value is ignored, and the grader checks `matrix` after your function runs.

```js
function rotate(matrix) // → void (mutates matrix)
```

## Examples

```text
Input:  matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output (matrix after the call): [[7,4,1],[8,5,2],[9,6,3]]
Explanation: The first column read bottom-up, [7,4,1], becomes the first row.

Input:  matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output (matrix after the call): [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

## Constraints

- 1 ≤ n ≤ 20
- −1000 ≤ `matrix[i][j]` ≤ 1000

## Notes

- **Identify:** rotate an n × n matrix 90° clockwise in place → transpose, then reverse each row
- **Brute force:** copy into a new matrix with result[c][n − 1 − r] = m[r][c], O(n²) extra space
- **Insight:** a clockwise turn equals a flip over the main diagonal followed by a left–right mirror
- **Steps:** for r < c swap m[r][c] and m[c][r]; then reverse every row
- **Complexity:** O(n²) time either way; O(n²) → O(1) extra space
- **Pitfall:** transpose only the upper triangle (c > r), or every pair is swapped back
- **Related:** Spiral Matrix, Set Matrix Zeroes, Valid Sudoku
