---
title: Word Search
type: dsa
difficulty: medium
topic: backtracking
order: 6
neetcode: true
tags: [backtracking, matrix, dfs]
estimatedMinutes: 25
---

You get a grid `board` of single characters and a string `word`. Return `true` if you can spell `word` by starting at some cell and repeatedly stepping to a **horizontally or vertically adjacent** cell, never using the same cell twice in one path. Letters are case-sensitive.

```js
function exist(board, word) // → boolean
```

## Examples

```text
Input:  board = [["A","B","C","E"],
                 ["S","F","C","S"],
                 ["A","D","E","E"]], word = "ABCCED"
Output: true

Input:  same board, word = "SEE"
Output: true

Input:  same board, word = "ABCB"
Output: false
Explanation: the second B would need to reuse the B cell.
```

## Constraints

- 1 ≤ rows, cols ≤ 6
- 1 ≤ `word.length` ≤ 15
- `board` and `word` contain only English letters

## Notes

- **Identify:** word as a path of adjacent cells, no reuse → DFS backtracking from each cell
- **Brute force:** enumerate every path of length L from every cell, then compare with the word
- **Insight:** prune as you go: stop a path the moment a letter doesn't match
- **Steps:** for each cell, dfs(r, c, i): bounds and letter must match; mark the cell; try 4 neighbours for i + 1; unmark
- **Complexity:** O(m·n·4^L) worst case (3^L after the first step), O(L) recursion depth
- **Pitfall:** restore the cell after exploring, or other starting points see a damaged board
- **Related:** Word Search II, Number of Islands, Palindrome Partitioning
