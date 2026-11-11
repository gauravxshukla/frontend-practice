---
title: Longest Common Subsequence
type: dsa
difficulty: medium
topic: 2d-dp
order: 2
neetcode: true
tags: [dynamic-programming, strings]
estimatedMinutes: 25
---

Return the length of the longest string that is a **subsequence of both** `text1` and `text2`, or `0` if they share no characters. A subsequence keeps the original order but may skip characters.

```js
function longestCommonSubsequence(text1, text2) // → number
```

## Examples

```text
Input:  text1 = "abcde", text2 = "ace"
Output: 3
Explanation: "ace" appears in order in both.

Input:  text1 = "abc", text2 = "abc"
Output: 3

Input:  text1 = "abc", text2 = "def"
Output: 0
```

## Constraints

- 1 ≤ `text1.length`, `text2.length` ≤ 1000
- Both strings contain only lowercase English letters

## Notes

- **Identify:** longest subsequence shared by two strings → 2-D DP over prefixes
- **Key formula:** match → dp[i][j] = dp[i − 1][j − 1] + 1; else max(dp[i − 1][j], dp[i][j − 1])
- **Brute force:** try all 2^m subsequences of one string against the other, O(2^m · n)
- **Insight:** the answer for two prefixes depends only on shorter prefixes, so fill a table once
- **Steps:** (m + 1) × (n + 1) table of zeros; fill row by row with the formula; return the bottom-right
- **Complexity:** O(2^m · n) → O(m·n) time, O(m·n) space (one row is enough: O(n))
- **Pitfall:** the extra zero row and column stand for empty prefixes, so index the strings at i − 1, j − 1
- **Related:** Edit Distance, Distinct Subsequences, Longest Increasing Subsequence
