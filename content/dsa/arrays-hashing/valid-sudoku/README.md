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

- **Identify:** no repeated digit in any row, column or 3×3 box → one hash set per unit
- **Key formula:** box index = (r / 3) × 3 + c / 3, with integer division
- **Brute force:** validate each row, each column, then each box in three separate scans
- **Insight:** one pass is enough: each filled cell checks its row, column and box sets at once
- **Steps:** for each filled cell, if its digit is already in its row, column or box set return false; else add it
- **Complexity:** O(81) either way, i.e. O(1) time and space; one pass instead of three
- **Pitfall:** skip '.' cells, and don't check solvability: only filled cells must be valid
- **Related:** Contains Duplicate, Set Matrix Zeroes, N-Queens
