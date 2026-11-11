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

- **Identify:** letter order from a sorted alien word list → build "a before b" edges, then topological sort
- **Brute force:** try every permutation of the letters and check the list is sorted under it, O(k!·total)
- **Insight:** only the first differing letter of each adjacent word pair gives an ordering rule
- **Steps:** add every letter; for each adjacent pair, add an edge at the first difference; Kahn's BFS; cycle → ""
- **Complexity:** O(k!·total) → O(total characters + 26²) time, O(26²) space
- **Pitfall:** a word followed by its own prefix ("abc", "ab") is invalid: return ""
- **Related:** Course Schedule II, Course Schedule, Reconstruct Itinerary
