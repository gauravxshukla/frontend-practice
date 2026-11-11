---
title: Regular Expression Matching
type: dsa
difficulty: hard
topic: 2d-dp
order: 11
neetcode: true
tags: [dynamic-programming, strings, recursion]
estimatedMinutes: 40
---

Implement a tiny regular-expression matcher. The pattern `p` contains lowercase letters plus two special characters:

- `.` matches any single character.
- `*` matches **zero or more** copies of the character right before it (which may be `.`).

Return `true` only if the pattern matches the **entire** string `s`, not just part of it.

```js
function isMatch(s, p) // → boolean
```

## Examples

```text
Input:  s = "aa", p = "a"
Output: false
Explanation: The pattern covers only one character.

Input:  s = "aa", p = "a*"
Output: true
Explanation: "a*" repeats "a" twice.

Input:  s = "ab", p = ".*"
Output: true
Explanation: ".*" matches any string.
```

## Constraints

- 1 ≤ `s.length` ≤ 20, 1 ≤ `p.length` ≤ 20
- `s` contains only lowercase letters; `p` contains lowercase letters, `.` and `*`
- Every `*` has a valid (non-`*`) character before it

## Notes

- **Identify:** full-string match with "." and "x*" → 2-D DP over suffixes of s and p
- **Key formula:** p[j + 1] = "*" → dp[i][j + 2] or (first matches and dp[i + 1][j]); else first matches and dp[i + 1][j + 1]
- **Brute force:** plain recursion on both "*" choices, exponential on patterns like "a*a*a*…"
- **Insight:** the result only depends on (i, j), the suffixes still to match, so fill a table from the end
- **Steps:** dp[m][n] = true; for i from m down, j from n − 1 down, apply the formula; return dp[0][0]
- **Complexity:** exponential → O(m·n) time, O(m·n) space
- **Pitfall:** "x*" can match zero characters, so dp[i][j + 2] must be tried even when s is used up
- **Related:** Design Add and Search Words Data Structure, Edit Distance, Interleaving String
