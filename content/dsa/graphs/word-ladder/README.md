---
title: Word Ladder
type: dsa
difficulty: hard
topic: graphs
order: 13
neetcode: true
tags: [graphs, bfs, strings, hash-map]
estimatedMinutes: 30
---

You get a `beginWord`, an `endWord` and a dictionary `wordList`. All words have the same length and use lowercase letters.

A **transformation sequence** starts at `beginWord`, ends at `endWord`, and each step changes exactly **one letter** to produce a word that is in `wordList`. (`beginWord` itself does not need to be in the list.)

Return the number of words in the **shortest** such sequence, counting both `beginWord` and `endWord`. If no sequence exists, return `0`.

```js
function ladderLength(beginWord, endWord, wordList) // → number
```

## Examples

```text
Input:  beginWord = "hit", endWord = "cog",
        wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
Explanation: hit → hot → dot → dog → cog has 5 words.

Input:  beginWord = "hit", endWord = "cog",
        wordList = ["hot","dot","dog","lot","log"]
Output: 0
Explanation: "cog" is not in the dictionary, so it can never be reached.
```

## Constraints

- 1 ≤ word length ≤ 10
- 1 ≤ `wordList.length` ≤ 5000
- `beginWord !== endWord`; the words in `wordList` are unique

## Notes

- **Identify:** fewest one-letter changes from begin to end → BFS over words (unweighted shortest path)
- **Brute force:** compare every pair of words to build the graph first, O(n²·L), then BFS
- **Insight:** instead of comparing pairs, try all 26 letters at each position and look the result up in a set
- **Steps:** BFS from beginWord with level 1; for each word, generate neighbours in the set; remove them when queued
- **Complexity:** O(n²·L) → O(n·L·26) time (plus L for each string), O(n·L) space
- **Pitfall:** endWord missing from the list means 0; remove words when queued so none is visited twice
- **Related:** Rotting Oranges, Walls and Gates, Network Delay Time
