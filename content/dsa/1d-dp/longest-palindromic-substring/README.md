---
title: Longest Palindromic Substring
type: dsa
difficulty: medium
topic: 1d-dp
order: 5
neetcode: true
tags: [strings, dynamic-programming, two-pointers]
estimatedMinutes: 25
---

Given a string `s`, return its **longest contiguous substring that reads the same forwards and backwards**. If several substrings tie for the longest length, any one of them is accepted.

```js
function longestPalindrome(s) // → string
```

## Examples

```text
Input:  s = "babad"
Output: "bab"
Explanation: "aba" is equally long and also accepted.

Input:  s = "cbbd"
Output: "bb"
```

## Constraints

- 1 ≤ `s.length` ≤ 1000
- `s` contains only digits and English letters (case-sensitive)

## Notes

- **Identify:** longest contiguous palindrome → expand around every centre
- **Brute force:** check every substring for being a palindrome, O(n³)
- **Better:** dp[i][j] = s[i] == s[j] and dp[i + 1][j − 1], O(n²) time and O(n²) space
- **Insight:** every palindrome grows outward from a centre; there are only 2n − 1 centres (letters and gaps)
- **Steps:** for each i, expand from (i, i) and (i, i + 1) while ends match; keep the longest span
- **Complexity:** O(n³) → O(n²) time, O(n²) → O(1) space
- **Pitfall:** even-length palindromes ("abba") need the gap centre (i, i + 1)
- **Related:** Palindromic Substrings, Palindrome Partitioning, Valid Palindrome
