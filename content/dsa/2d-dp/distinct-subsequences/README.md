---
title: Distinct Subsequences
type: dsa
difficulty: hard
topic: 2d-dp
order: 8
neetcode: true
tags: [dynamic-programming, strings]
estimatedMinutes: 30
---

Return how many different ways you can pick characters from `s`, keeping their order, so that the picked characters spell exactly `t`. Two ways are different if they use a different set of **positions** in `s`.

```js
function numDistinct(s, t) // → number
```

## Examples

```text
Input:  s = "rabbbit", t = "rabbit"
Output: 3
Explanation: Any two of the three b's can be used, so there are 3 ways.

Input:  s = "babgbag", t = "bag"
Output: 5
```

## Constraints

- 1 ≤ `s.length`, `t.length` ≤ 1000
- Both strings contain only English letters
- The answer fits in a signed 32-bit integer

## Notes

- **Identify:** count ways t appears as a subsequence of s → 2-D DP over prefixes
- **Key formula:** dp[i][j] = dp[i − 1][j] + (s[i − 1] = t[j − 1] ? dp[i − 1][j − 1] : 0)
- **Brute force:** try every subsequence of s of length |t|, O(2^m)
- **Insight:** each char of s is either skipped or (if it matches) used for t's next char; both counts come from shorter prefixes
- **Steps:** dp[i][0] = 1 (empty t); fill row by row with the formula; return dp[m][n]
- **Complexity:** O(2^m) → O(m·n) time, O(m·n) space (one row is enough: O(n))
- **Pitfall:** the empty target matches once in any prefix, so column 0 starts at 1
- **Related:** Longest Common Subsequence, Edit Distance, Interleaving String
