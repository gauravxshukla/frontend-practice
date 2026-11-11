---
title: Word Search II
type: dsa
difficulty: hard
topic: tries
order: 3
neetcode: true
tags: [trie, backtracking, dfs, matrix]
estimatedMinutes: 40
---

You get an `m × n` `board` of lowercase letters and a list of distinct `words`. Return every word from the list that can be traced on the board.

A word is traced by starting on any cell and stepping to a horizontally or vertically **adjacent** cell for each next letter. The same cell can't be used twice within one word. Return the found words in any order, each word once.

```js
function findWords(board, words) // → string[]
```

## Examples

```text
Input:  board = [["o","a","a","n"],
                 ["e","t","a","e"],
                 ["i","h","k","r"],
                 ["i","f","l","v"]]
        words = ["oath","pea","eat","rain"]
Output: ["oath","eat"]

Input:  board = [["a","b"],
                 ["c","d"]]
        words = ["abcb"]
Output: []
Explanation: "abcb" would need to reuse the "b" cell.
```

## Constraints

- 1 ≤ m, n ≤ 12
- 1 ≤ `words.length` ≤ 3 · 10⁴, 1 ≤ `words[i].length` ≤ 10
- Board cells and words use lowercase English letters. All words are distinct.

## Notes

- **Identify:** find many words on a letter grid → trie of the words + backtracking DFS from each cell
- **Brute force:** run Word Search separately for every word, O(words · cells · 4^L)
- **Insight:** build one trie of all words; a single DFS per cell follows the trie and finds every word at once
- **Steps:** insert words (store the word at its end node); DFS cells along trie children; record and clear found words
- **Complexity:** O(words · cells · 4^L) → O(cells · 4^L) time, O(total word length) space
- **Pitfall:** mark cells visited during a path and restore them after; clear a found word so it's added once
- **Related:** Word Search, Implement Trie (Prefix Tree), Design Add and Search Words Data Structure
