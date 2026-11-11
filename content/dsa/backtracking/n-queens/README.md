---
title: N-Queens
type: dsa
difficulty: hard
topic: backtracking
order: 9
neetcode: true
tags: [backtracking, matrix, hash-set]
estimatedMinutes: 30
---

Place `n` chess queens on an `n × n` board so that no two of them attack each other: no two share a row, a column, or a diagonal. Return **every** valid board. Each board is an array of `n` strings, one per row from top to bottom, where `'Q'` is a queen and `'.'` is an empty square. Return the boards in any order. If there's no solution, return `[]`.

```js
function solveNQueens(n) // → string[][]
```

## Examples

```text
Input:  n = 4
Output: [[".Q..","...Q","Q...","..Q."],
         ["..Q.","Q...","...Q",".Q.."]]

Input:  n = 1
Output: [["Q"]]
```

## Constraints

- 1 ≤ `n` ≤ 9

## Notes

- **Identify:** place n queens so none attack → backtracking row by row with attack sets
- **Key formula:** same "\" diagonal ⇔ equal r − c; same "/" diagonal ⇔ equal r + c
- **Brute force:** try every placement of n queens on n² squares and check each board
- **Insight:** one queen per row; sets of used columns and diagonals make each safety check O(1)
- **Steps:** dfs(r): for each column c not attacked, place the queen, mark col / r − c / r + c, recurse r + 1, unmark
- **Complexity:** O(C(n², n)) → O(n!) time, O(n) space besides the output
- **Pitfall:** n = 2 and n = 3 have no solutions: return an empty list
- **Related:** Permutations, Word Search, Valid Sudoku
