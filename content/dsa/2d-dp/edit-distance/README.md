---
title: Edit Distance
type: dsa
difficulty: medium
topic: 2d-dp
order: 9
neetcode: true
tags: [dynamic-programming, strings]
estimatedMinutes: 30
---

Return the minimum number of single-character edits needed to turn `word1` into `word2`. One edit is **inserting** a character, **deleting** a character, or **replacing** one character with another.

```js
function minDistance(word1, word2) // → number
```

## Examples

```text
Input:  word1 = "horse", word2 = "ros"
Output: 3
Explanation: horse → rorse (replace h) → rose (delete r) → ros (delete e).

Input:  word1 = "intention", word2 = "execution"
Output: 5
```

## Constraints

- 0 ≤ `word1.length`, `word2.length` ≤ 500
- Both strings contain only lowercase English letters

## Notes

- **Identify:** fewest inserts, deletes and replaces to turn one word into another → 2-D DP over prefixes
- **Key formula:** match → dp[i − 1][j − 1]; else 1 + min(delete dp[i − 1][j], insert dp[i][j − 1], replace dp[i − 1][j − 1])
- **Brute force:** recurse over all three operations at every mismatch, O(3^(m+n))
- **Insight:** the cost for two prefixes depends only on the three neighbouring smaller prefixes
- **Steps:** dp[i][0] = i, dp[0][j] = j; fill the table with the formula; return dp[m][n]
- **Complexity:** O(3^(m+n)) → O(m·n) time, O(m·n) space (one row is enough: O(n))
- **Pitfall:** the base row and column are the cost of turning a prefix into an empty string (and back)
- **Related:** Longest Common Subsequence, Distinct Subsequences, Interleaving String
