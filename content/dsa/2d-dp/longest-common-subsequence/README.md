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

- **Key insight:** compare the last characters of the two prefixes. If they match, they can both be the last character of the LCS. If not, at least one of them is unused, so drop one and take the better result.
- **Recurrence:** `lcs(i, 0) = lcs(0, j) = 0`; `lcs(i, j) = lcs(i - 1, j - 1) + 1` if `text1[i - 1] === text2[j - 1]`, else `max(lcs(i - 1, j), lcs(i, j - 1))`.
- **2-D table:** O(m · n) time and space. The full table also lets you reconstruct the subsequence by walking back from `(m, n)`.
- **Space optimisation:** row `i` reads only row `i - 1`, so keep two rows (or one row plus a saved diagonal). O(m · n) time, O(min(m, n)) space if you iterate over the shorter string in the inner loop.
- **Brute force:** enumerate all 2ᵐ subsequences of one string and test each against the other. O(2ᵐ · n).
- Pitfall: confusing subsequence with substring. Longest common **substring** resets to 0 on a mismatch instead of taking the max.
- Edge cases: identical strings → their length; no shared letters → 0.
- Follow-ups: Edit Distance and Shortest Common Supersequence (`m + n - lcs`) use the same table shape.
