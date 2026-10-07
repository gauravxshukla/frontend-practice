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

- **Key insight:** choose the first piece, which must be a palindrome prefix, then partition the rest the same way.
- **Backtracking:** `backtrack(start)` tries every `end ≥ start`. If `s[start..end]` is a palindrome, push it, recurse on `end + 1`, then pop. At `start === n`, record a copy.
- **Palindrome table:** precompute `isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i+1][j-1])` in O(n²), so every check during the search is O(1).
- Complexity: O(n · 2ⁿ) worst case (for example `"aaaa…"`, where every split is valid), plus O(n²) for the table.
- **Brute force:** try all 2ⁿ⁻¹ ways to cut the string and keep those where every piece is a palindrome.
- Pitfall: checking palindromes with `reverse()` inside the search. It works, but adds an O(n) factor to every check.
- Pitfall: comparing partitions as unordered sets. `["a","ab"]` and `["ab","a"]` are different strings.
- Follow-up: Palindrome Partitioning II, the **minimum** number of cuts, which is an O(n²) DP with no enumeration.
