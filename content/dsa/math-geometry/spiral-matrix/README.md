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

- **Key insight:** keep four shrinking boundaries, `top`, `bottom`, `left`, `right`. Each pass peels one ring off the matrix.
- Loop while `top ≤ bottom && left ≤ right`: read the top row (left → right) then `top++`; read the right column (top → bottom) then `right--`.
- Then **re-check** before the last two sides: if `top ≤ bottom`, read the bottom row (right → left) and `bottom--`; if `left ≤ right`, read the left column (bottom → top) and `left++`.
- O(m·n) time, O(1) extra space besides the output.
- Alternative: simulate with a direction vector and a `visited` grid, turning right whenever the next cell is out of bounds or already visited. Simpler logic, O(m·n) extra space.
- Pitfall: skipping the re-checks makes single-row or single-column leftovers get read twice (try a 3×1 or 1×4 matrix).
- Edge cases: one row, one column, one element, non-square shapes.
- Follow-up: Spiral Matrix II, which fills an n × n matrix with 1..n² in spiral order.
