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

- **Key insight:** words are nodes and one-letter changes are edges, all with weight 1, so the shortest sequence is a **BFS** from `beginWord`.
- Generating neighbours efficiently: bucket every dictionary word under each of its wildcard patterns (`"hot"` goes into `"*ot"`, `"h*t"`, `"ho*"`). A word's neighbours are everything in its buckets.
- BFS level by level, counting words. Return the level as soon as `endWord` is generated; return `0` if the queue empties.
- O(N · L²) time, where N is the dictionary size and L the word length (building each pattern string costs L). O(N · L²) space for the buckets.
- Alternative neighbour generation: try all 26 letters at each position and look the result up in a `Set`; O(N · 26 · L²).
- Brute-force baseline: compare every pair of words to build edges, O(N² · L), too slow for 5000 words.
- Optimization: once a bucket has been expanded, delete it; every word inside is already visited.
- Optimization: bidirectional BFS from both ends, always expanding the smaller frontier, cuts the search dramatically.
- Pitfalls: returning the number of *steps* instead of the number of *words* (off by one); forgetting the `endWord`-not-in-list check.
- Follow-up: "Word Ladder II", which returns every shortest sequence (BFS to build a parent DAG, then backtrack).
