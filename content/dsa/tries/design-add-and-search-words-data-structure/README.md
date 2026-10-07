---
title: Design Add and Search Words Data Structure
type: dsa
difficulty: medium
topic: tries
order: 2
neetcode: true
tags: [design, trie, dfs, strings]
estimatedMinutes: 25
---

Build a `WordDictionary` class that stores words and answers pattern queries.

- `new WordDictionary()` creates an empty dictionary.
- `addWord(word)` stores `word`.
- `search(pattern)` returns `true` if some stored word matches `pattern` **exactly, letter for letter**, where a `.` in the pattern matches any single letter. The match must cover the whole word, so lengths must be equal.

```js
class WordDictionary {
  addWord(word)     // → void
  search(pattern)   // → boolean
}
```

## Examples

The judge calls the methods in order. `operations[i]` is called with `arguments[i]`, and the output lists each call's return value (`null` for the constructor and for `addWord`).

```text
Input:
  operations = ["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
  arguments  = [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]
Output: [null,null,null,null,false,true,true,true]

Input:
  operations = ["WordDictionary","addWord","search","search","search"]
  arguments  = [[],["a"],["."],[".."],["a."]]
Output: [null,null,true,false,false]
Explanation: patterns must be the same length as a stored word.
```

## Constraints

- 1 ≤ `word.length` ≤ 25
- Words added contain lowercase letters only. Patterns contain lowercase letters and `.`.
- A pattern contains at most 2 dots.
- At most 10⁴ calls in total.

## Notes

- **Key insight:** a trie handles exact letters in O(L). The `.` wildcard just means "try every child here", which turns `search` into a DFS over the trie.
- `addWord` is the standard trie insert, O(L).
- `search(pattern, i, node)`: at the end, return `node.isEnd`. On a letter, follow that one child. On `.`, recurse into each child and return `true` on the first success.
- Time: O(L) without dots. With dots the worst case is O(26^d · L) for d dots, which the "at most 2 dots" bound keeps small.
- Baseline: store words bucketed by length and compare the pattern against each word of that length. O(n · L) per search, simple and fine to mention first.
- Pitfall: returning `true` when the path exists but `isEnd` is false (a pattern matching only a prefix of a stored word).
- Pitfall: returning from the `.` loop after the first child instead of only on success.
- Follow-up: support `*` (any sequence of letters), or cache results of repeated patterns.
