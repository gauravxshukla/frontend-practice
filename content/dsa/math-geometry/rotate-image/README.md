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

- **Key insight:** a clockwise rotation is a **transpose** (swap across the main diagonal) followed by **reversing each row**. Both steps are easy to do in place.
- Transpose: for `i < j`, swap `m[i][j]` and `m[j][i]`. Only touch the upper triangle, or you'll swap everything back.
- Then `row.reverse()` for every row.
- O(n²) time, O(1) extra space.
- Alternative: rotate layer by layer, moving four cells at a time (`top → right → bottom → left → top`). Same complexity, more index bookkeeping.
- Baseline (not allowed here): build a new matrix with `out[j][n − 1 − i] = m[i][j]` and copy it back. O(n²) extra space.
- Pitfall: reassigning `matrix = newMatrix` inside the function doesn't change the caller's matrix.
- Follow-up: counter-clockwise is transpose then reverse the **columns** (or reverse rows first, then transpose).
