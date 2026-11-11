---
title: Palindrome Partitioning
type: dsa
difficulty: medium
topic: backtracking
order: 7
neetcode: true
tags: [backtracking, strings, dynamic-programming]
estimatedMinutes: 25
---

You get a string `s`. Split it into pieces so that **every piece is a palindrome** (reads the same forwards and backwards), and return every possible way to do that. Each answer is the list of pieces in left-to-right order, so joining it gives back `s`. You can return the partitions in any order, but the pieces inside a partition stay in string order.

```js
function partition(s) // → string[][]
```

## Examples

```text
Input:  s = "aab"
Output: [["a","a","b"],["aa","b"]]

Input:  s = "a"
Output: [["a"]]
```

## Constraints

- 1 ≤ `s.length` ≤ 16
- `s` contains only lowercase English letters

## Notes

- **Identify:** every way to cut a string into palindromes → backtracking over cut positions
- **Brute force:** try all 2^(n−1) cut patterns, then check every piece afterwards
- **Insight:** only cut off a prefix that is already a palindrome, so invalid branches die immediately
- **Steps:** dfs(start): at the end save the path; for each end ≥ start, if s[start..end] is a palindrome, add it and recurse at end + 1
- **Complexity:** O(n·2^n) time, O(n) recursion depth
- **Pitfall:** a single character is always a palindrome, so every string has at least one partition
- **Related:** Palindromic Substrings, Longest Palindromic Substring, Subsets
