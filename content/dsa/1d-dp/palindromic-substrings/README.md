---
title: Palindromic Substrings
type: dsa
difficulty: medium
topic: 1d-dp
order: 6
neetcode: true
tags: [strings, dynamic-programming, two-pointers]
estimatedMinutes: 20
---

Return how many **substrings** of `s` are palindromes. Substrings are counted by position, so the same text appearing at two different places counts twice (in `"aaa"`, each `"a"` is counted separately).

```js
function countSubstrings(s) // → number
```

## Examples

```text
Input:  s = "abc"
Output: 3
Explanation: Only the three single letters.

Input:  s = "aaa"
Output: 6
Explanation: "a" three times, "aa" twice, "aaa" once.
```

## Constraints

- 1 ≤ `s.length` ≤ 1000
- `s` contains only lowercase English letters

## Notes

- **Identify:** count every palindromic substring → expand around every centre and count each step
- **Brute force:** check all O(n²) substrings, each in O(n), O(n³)
- **Better:** a dp[i][j] palindrome table, O(n²) time and space
- **Insight:** each successful expansion from a centre is one more palindrome, so count while expanding
- **Steps:** for each i, expand from (i, i) and (i, i + 1); add 1 for every matching step
- **Complexity:** O(n³) → O(n²) time, O(n²) → O(1) space
- **Pitfall:** single letters count, and so do overlapping palindromes ("aaa" has 6)
- **Related:** Longest Palindromic Substring, Palindrome Partitioning, Valid Palindrome
