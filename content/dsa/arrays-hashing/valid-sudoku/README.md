---
title: Valid Sudoku
type: dsa
difficulty: medium
topic: arrays-hashing
order: 8
neetcode: true
tags: [arrays, hash-set, matrix]
estimatedMinutes: 20
---

You get a 9×9 Sudoku `board` as an array of rows. Each cell is a digit `"1"`–`"9"` or `"."` for an empty cell. Return `true` if the digits placed so far break no rule:

- no digit repeats within a row,
- no digit repeats within a column,
- no digit repeats within any of the nine 3×3 boxes.

You don't need to check whether the puzzle is *solvable*, only that the filled cells are consistent.

```js
function isValidSudoku(board) // → boolean
```

## Examples

```text
Input: board =
  [["1",".","3",".","5",".","7",".","9"],
   [".","5",".","7",".","9",".","2","."],
   [".",".",".",".",".",".",".",".","."],
   ["2",".","4",".","6",".","8",".","1"],
   [".","6",".","8",".","1",".","3","."],
   [".","9",".","2",".","4",".","6","."],
   ["3",".","5",".","7",".","9",".","2"],
   [".",".",".",".",".",".",".",".","."],
   [".","1",".","3",".","5",".","7","."]]
Output: true

Input: the same board, but with board[0][1] = "1"
Output: false
Explanation: row 0 (and the top-left box) now contains "1" twice.
```

## Constraints

- `board.length` = `board[i].length` = 9
- Each `board[i][j]` is `"1"`–`"9"` or `"."`.

## Notes

- **Key insight:** a single pass works if you keep one "seen" set per row, per column, and per box.
- Box index for cell `(r, c)` is `Math.floor(r / 3) * 3 + Math.floor(c / 3)`, which numbers the boxes 0–8 left to right, top to bottom.
- For each filled cell, if its digit is already in the row, column, or box set, return `false`. Otherwise add it to all three.
- O(81) = O(1) time and space for a fixed-size board. In general it's O(n²) for an n×n board.
- **Alternative:** three separate passes (rows, then columns, then boxes). It's the same complexity with more code, and a fine baseline.
- Pitfall: getting the box mapping wrong. Test a duplicate that shares a box but *not* a row or column, such as `(3,3)` and `(4,4)`.
- Pitfall: treating `"."` as a value, so two empty cells look like a duplicate.
- Follow-up: use three arrays of 9-bit masks instead of sets, which is smaller and faster. Then extend to a backtracking Sudoku solver.
