---
title: Implement Trie (Prefix Tree)
type: dsa
difficulty: medium
topic: tries
order: 1
neetcode: true
tags: [design, trie, strings]
estimatedMinutes: 20
---

Build a `Trie` class, a tree that stores strings character by character so shared prefixes are stored once. It supports:

- `new Trie()`, which creates an empty trie.
- `insert(word)`, which adds `word`.
- `search(word)`, which returns `true` only if `word` itself was inserted earlier (a word that's merely a prefix of something inserted doesn't count).
- `startsWith(prefix)`, which returns `true` if at least one inserted word begins with `prefix`.

```js
class Trie {
  insert(word)        // → void
  search(word)        // → boolean
  startsWith(prefix)  // → boolean
}
```

## Examples

The judge calls the methods in order. `operations[i]` is called with `arguments[i]`, and the output lists each call's return value (`null` for the constructor and for `insert`).

```text
Input:
  operations = ["Trie","insert","search","search","startsWith","insert","search"]
  arguments  = [[],["apple"],["apple"],["app"],["app"],["app"],["app"]]
Output: [null,null,true,false,true,null,true]
Explanation: "app" is only a prefix until it's inserted as a word of its own.

Input:
  operations = ["Trie","insert","insert","startsWith","search","startsWith"]
  arguments  = [[],["car"],["cat"],["ca"],["ca"],["dog"]]
Output: [null,null,null,true,false,false]
```

## Constraints

- 1 ≤ `word.length`, `prefix.length` ≤ 2000
- Words and prefixes contain lowercase English letters only.
- At most 3 · 10⁴ calls in total.

## Notes

- **Identify:** insert words, then exact search and prefix search → trie (prefix tree)
- **Brute force:** store words in a list and scan it for every query, O(n·L) per call
- **Insight:** words sharing a prefix share a path, so any query walks just L nodes
- **Steps:** each node has children by char and an end flag; insert creates the path; search/startsWith walk it
- **Complexity:** O(n·L) → O(L) per operation, O(total characters) space
- **Pitfall:** search needs the end flag on the last node; startsWith only needs the path to exist
- **Related:** Design Add and Search Words Data Structure, Word Search II, Word Search
