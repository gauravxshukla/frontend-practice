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

- **Key insight:** exactly one queen goes in each row. Place them row by row, and only check columns and the two diagonal directions.
- **Constant-time conflict checks:** on a `\` diagonal, `r - c` is constant. On a `/` diagonal, `r + c` is constant. Keep three sets (`cols`, `diag`, `anti`) and check them in O(1).
- **Backtracking:** in row `r`, try each column that isn't attacked. Add it to the three sets, recurse on `r + 1`, then remove it. At `r === n`, build the board strings.
- Complexity: O(n!) placements in the worst case, and much less in practice thanks to pruning. O(n) extra space plus the output.
- **Brute force:** try every permutation of columns (one per row, so columns are already distinct) and keep those with no shared diagonal. That's O(n! · n²).
- Pitfall: only checking the main diagonal direction, or comparing `r - c` across both directions.
- n = 2 and n = 3 have no solutions, so return `[]`.
- Bitmask optimisation: store the three sets as integers and get the free columns with `~(cols | diag | anti) & ((1 << n) - 1)`.
- Follow-up: N-Queens II, where you only count the solutions. The same search runs without building strings.
