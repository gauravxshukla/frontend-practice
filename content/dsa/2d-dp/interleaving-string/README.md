---
title: Interleaving String
type: dsa
difficulty: medium
topic: 2d-dp
order: 6
neetcode: true
tags: [dynamic-programming, strings]
estimatedMinutes: 30
---

Return `true` if `s3` can be formed by **interleaving** `s1` and `s2`: walk through `s3` taking each character from either `s1` or `s2`, so that every character of both is used exactly once and each string's own order is kept. The pieces may alternate in any pattern.

```js
function isInterleave(s1, s2, s3) // → boolean
```

## Examples

```text
Input:  s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
Explanation: "aa" + "dbbc" + "bc" + "a" + "c", alternating between s1 and s2.

Input:  s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
Output: false

Input:  s1 = "", s2 = "", s3 = ""
Output: true
```

## Constraints

- 0 ≤ `s1.length`, `s2.length` ≤ 100
- 0 ≤ `s3.length` ≤ 200
- All strings are lowercase English letters

## Notes

- **Identify:** is s3 a merge of s1 and s2 keeping each order → 2-D DP over how much of each is used
- **Key formula:** dp[i][j] = (dp[i − 1][j] and s1[i − 1] = s3[i + j − 1]) or (dp[i][j − 1] and s2[j − 1] = s3[i + j − 1])
- **Brute force:** recurse choosing s1 or s2 for each next character of s3, O(2^(m+n))
- **Insight:** the state is just (i, j) characters used; s3's position is i + j, so a table covers it
- **Steps:** lengths must add up; dp[0][0] = true; fill the table with the formula; return dp[m][n]
- **Complexity:** O(2^(m+n)) → O(m·n) time, O(m·n) space (one row is enough: O(n))
- **Pitfall:** check len(s1) + len(s2) == len(s3) first, or the table answers a different question
- **Related:** Longest Common Subsequence, Edit Distance, Distinct Subsequences
