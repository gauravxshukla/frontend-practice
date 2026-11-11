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

- **Identify:** add words, search with "." wildcards → trie + DFS that branches on "."
- **Brute force:** keep a list and compare each word char by char with the pattern, O(n·L) per search
- **Insight:** a trie handles fixed letters in one step; only "." needs to try every child
- **Steps:** addWord inserts into the trie; search(i, node): letter → follow one child; "." → try all children
- **Complexity:** O(n·L) → O(L) per search without dots, up to O(26^dots · L) with them
- **Pitfall:** a match must end on a node marked as a word end, not just any node at that depth
- **Related:** Implement Trie (Prefix Tree), Word Search II, Regular Expression Matching
