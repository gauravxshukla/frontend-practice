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

- **Key insight:** a prefix `s[0..i)` is breakable exactly when some dictionary word ends at `i` and the prefix before that word is breakable.
- **Recurrence:** `ok(0) = true`, `ok(i) = OR over words w ending at i of ok(i - |w|)`. The answer is `ok(n)`.
- **Bottom-up:** for each `i`, try only the distinct word lengths (at most 20) and look the slice up in a `Set`. O(n · L · L) time with L = max word length (the slice costs L), O(n) space.
- The DP is already one-dimensional. Since a word can be up to 20 long, the table cannot shrink to a fixed window smaller than `maxLen + 1` entries.
- **Brute force:** recursively try every dictionary word as the next piece. On `"aaaa…ab"` with `["a", "aa", "aaa"]` it explores exponentially many splits before failing. Memoising on the start index turns it into the same O(n · L²) DP.
- **BFS view:** indices are nodes, and a dictionary word starting at `i` is an edge to `i + |w|`. Reach `n` from `0`.
- Pitfall: greedily taking the longest (or shortest) matching word. `"aaaaaaa"` with `["aaaa", "aaa"]` needs `aaa + aaaa`.
- Follow-up: Word Break II returns every valid sentence (backtracking with memoised suffix results).
