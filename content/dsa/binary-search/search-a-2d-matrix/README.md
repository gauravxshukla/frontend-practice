---
title: Search a 2D Matrix
type: dsa
difficulty: medium
topic: binary-search
order: 2
neetcode: true
tags: [arrays, matrix, binary-search]
estimatedMinutes: 15
---

You get an `m × n` grid of integers with two properties:

- each row is sorted in ascending order, and
- the first value of every row is larger than the last value of the row above it.

Return `true` if `target` appears anywhere in the grid, and `false` otherwise. Aim for O(log(m · n)) time.

```js
function searchMatrix(matrix, target) // → boolean
```

## Examples

```text
Input:  matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true

Input:  matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false
```

## Constraints

- 1 ≤ m, n ≤ 100
- −10⁴ ≤ `matrix[i][j]`, `target` ≤ 10⁴

## Notes

- **Identify:** rows sorted and each row starts after the previous ends → one sorted list in disguise
- **Key formula:** index i maps to row i / cols, column i % cols
- **Brute force:** scan every cell, O(m·n)
- **Better:** binary search for the row, then within it, O(log m + log n)
- **Insight:** treat the matrix as one sorted array of m·n items and binary search it once
- **Steps:** l = 0, r = m·n − 1; map mid to (row, col); compare and halve as in plain binary search
- **Complexity:** O(m·n) → O(log(m·n)) time, O(1) space
- **Pitfall:** divide and mod by the column count, not the row count, when converting mid
- **Related:** Binary Search, Search in Rotated Sorted Array, Koko Eating Bananas
