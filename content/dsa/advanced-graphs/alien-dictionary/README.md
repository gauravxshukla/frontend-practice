---
title: Alien Dictionary
type: dsa
difficulty: hard
topic: advanced-graphs
order: 5
neetcode: true
tags: [graphs, topological-sort, strings, cycle-detection]
estimatedMinutes: 30
---

An alien language uses lowercase English letters, but in an unknown order. You get a list `words` that is claimed to be **sorted** in that alien order (the same way a dictionary is sorted, letter by letter, with a word coming before any longer word it is a prefix of).

Return a string containing **every letter that appears in `words`**, each exactly once, in an order consistent with the sorted list. If several orders are consistent, any of them is accepted. If no order is consistent (the list cannot be sorted under any letter order), return `""`.

```js
function alienOrder(words) // → string
```

## Examples

```text
Input:  words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"

Input:  words = ["z","x"]
Output: "zx"

Input:  words = ["z","x","z"]
Output: ""
Explanation: z must come before x and x before z, which is impossible.
```

## Constraints

- 1 ≤ `words.length` ≤ 100
- 1 ≤ `words[i].length` ≤ 100
- Words contain only lowercase English letters

## Notes

- **Key insight:** comparing two **adjacent** words gives at most one rule: at their first differing position, the letter in the earlier word comes first. These rules form a directed graph, and the answer is a topological sort of it.
- Add every letter that appears as a node, even ones that never take part in a rule; they still belong in the output.
- For each adjacent pair, find the first index where they differ and add the edge. If there is no difference and the first word is **longer** (like `"abc"` before `"ab"`), the input is invalid, so return `""`.
- Run Kahn's algorithm (or DFS with three colours). If not every letter gets placed, there is a cycle, so return `""`.
- O(C) time, where C is the total number of characters across all words, plus O(U + E) for the sort (at most 26 letters). O(U + E) space.
- Pitfall: comparing every pair of words instead of adjacent ones is unnecessary; adjacent pairs already imply the rest by transitivity.
- Pitfall: only the **first** differing letter gives information; later letters say nothing.
- Pitfall: adding the same edge twice inflates in-degrees unless you deduplicate (or decrement once per copy).
- Follow-up: decide whether the order is **unique** (Kahn's queue must never hold more than one letter).
- Grading: any consistent order is accepted. The checker rebuilds the rules from `words` and confirms your string has exactly the letters that appear in `words`, each once, and respects every rule; or that it is `""` when the list is contradictory.
