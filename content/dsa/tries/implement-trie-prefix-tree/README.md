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

- **Key insight:** each node represents a prefix. Its children are keyed by the next character, and an `isEnd` flag marks nodes where a complete word stops.
- `insert`: walk from the root, creating missing children, then set `isEnd = true` on the last node.
- `search` and `startsWith` share one helper that walks the path and returns the final node (or `null`). `search` additionally requires `isEnd`.
- Each operation is O(L) for a string of length L. Space is O(total characters inserted) in the worst case.
- Baseline: keep a `Set` of words and scan it for `startsWith`. That's O(n · L) per prefix query, which is what the trie avoids.
- Children as a `Map` (or a plain object) handle any alphabet. A fixed array of 26 is faster and is what interviewers often expect in typed languages.
- Pitfall: `search` returning `true` for a prefix because it forgot to check `isEnd`.
- Follow-ups: `delete(word)` (unmark `isEnd` and prune empty nodes), counting words with a given prefix (store a counter on each node), or autocomplete.
