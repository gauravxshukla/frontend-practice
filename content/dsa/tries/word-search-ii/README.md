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

- **Key insight:** running Word Search I once per word repeats the same board walks again and again. Put all words in a **trie** and do one DFS from each cell that follows trie edges, so every word sharing a prefix is checked together.
- Store the full word on its end node (`node.word`). When the DFS reaches a node with a word, record it and clear it so it isn't reported twice.
- DFS from `(r, c)` with a trie node: stop if the board letter isn't a child, otherwise mark the cell (e.g. `'#'`), recurse in 4 directions, and restore the letter.
- **Pruning:** after exploring, delete a child that has no children and no word left. This turns repeated dead-end walks into instant misses and matters a lot on big inputs.
- Time: O(m · n · 4 · 3^(L−1)) in the worst case (L = longest word), but the trie and pruning make it far faster in practice. Space: O(total letters in words) for the trie plus O(L) recursion.
- Brute force: run single-word search for every word, O(W · m · n · 3^L), which times out on large word lists.
- Pitfall: forgetting to restore the cell after backtracking, or returning duplicates when a word can be traced in several ways.
- Edge cases: a 1×1 board, words longer than the cell count, words that are prefixes of other words (both must be found).
