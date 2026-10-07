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

- **Key insight:** you need to remember which rows and columns to clear *before* you start clearing, otherwise newly written zeros spread too far.
- Simple version: two sets (or boolean arrays) `rows` and `cols` from a first pass, then zero the cells in a second pass. O(m·n) time, O(m + n) space.
- **O(1) space:** reuse the first row and first column as the marker arrays. Remember separately whether the first row and first column themselves contained a zero.
- Pass 1: for every zero at `(i, j)`, set `m[i][0] = 0` and `m[0][j] = 0`.
- Pass 2: for `i ≥ 1, j ≥ 1`, zero `m[i][j]` if `m[i][0] === 0 || m[0][j] === 0`. Finally clear the first row/column if their flags say so.
- Pitfall: processing the first row/column before the inner cells destroys the markers.
- Pitfall: zeroing as you scan in a single pass. The new zeros look like original ones and wipe the whole matrix.
- Brute force: copy the matrix, scan the copy, and zero rows/columns in the original. O(m·n) extra space.
