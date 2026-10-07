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

- **Key insight:** a DFS from each cell, matching one letter per step. Mark a cell as used while it's on the current path, and un-mark it when you backtrack.
- **Backtracking:** `dfs(r, c, i)` fails if the cell is out of bounds or doesn't equal `word[i]`. Otherwise temporarily overwrite the cell (e.g. with `#`), try the 4 neighbours with `i + 1`, then restore it. Succeed when `i === word.length`.
- Complexity: O(R · C · 3^L) time, since after the first step each cell has at most 3 unvisited neighbours. O(L) recursion depth.
- **Pruning 1:** if the board doesn't contain enough of each letter in `word`, return `false` right away.
- **Pruning 2:** if the word's last letter is rarer on the board than its first letter, search for the reversed word instead. Inputs like a grid of `A`s with the word `AAAA…B` otherwise explode.
- Pitfall: forgetting to restore the cell, which corrupts later searches from other starting cells.
- Pitfall: a shared `visited` set that is never cleared between starting cells.
- If you mutate `board`, say so in an interview or restore it, since callers may not expect changes.
- Follow-up: Word Search II (many words at once), which uses a trie to share prefixes across all searches.
