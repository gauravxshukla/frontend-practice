---
title: Word Break
type: dsa
difficulty: medium
topic: 1d-dp
order: 10
neetcode: true
tags: [dynamic-programming, strings, hash-set]
estimatedMinutes: 25
---

Given a string `s` and a list of words `wordDict`, return `true` if `s` can be cut into a sequence of one or more dictionary words with nothing left over. Words may be reused any number of times.

```js
function wordBreak(s, wordDict) // → boolean
```

## Examples

```text
Input:  s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: "leet" + "code".

Input:  s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: "apple" + "pen" + "apple", reusing "apple".

Input:  s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
```

## Constraints

- 1 ≤ `s.length` ≤ 300
- 1 ≤ `wordDict.length` ≤ 1000, 1 ≤ `wordDict[i].length` ≤ 20
- All strings are lowercase English letters, and the dictionary words are distinct

## Notes

- **Identify:** can s be split into dictionary words → DP over prefixes
- **Key formula:** ok[i] = some word w ends at i with ok[i − len(w)]
- **Brute force:** try every split point recursively, O(2^n)
- **Insight:** whether a prefix can be split never changes, so compute each prefix once, shortest first
- **Steps:** ok[0] = true; for i = 1..n, for each word w, if s ends with w at i and ok[i − |w|], set ok[i]
- **Complexity:** O(2^n) → O(n · words · L) time, O(n) space
- **Pitfall:** words can be reused, and greedy longest-match fails ("aaaaaaa" with "aaaa", "aaa")
- **Related:** Decode Ways, Coin Change, Word Search II
