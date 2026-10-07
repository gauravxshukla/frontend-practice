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

- **Key insight:** grow palindromes outward from each of the `2n - 1` centres. Every step where both ends still match adds exactly one new palindrome.
- **Expand around centre:** O(n²) time in the worst case (`"aaaa…"`), O(1) space.
- **DP formulation:** `pal[i][j] = s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1])`; the answer is the number of true cells. O(n²) time and space.
- **Space optimisation of the DP:** row `i` reads only row `i + 1`, so a single array swept with `j` descending keeps it at O(n) space.
- **Brute force:** test all `n(n + 1) / 2` substrings with a two-pointer check. O(n³).
- Every single character is a palindrome, so the answer is always at least `n`.
- Pitfall: counting distinct palindromes instead of positions. The problem counts positions.
- Pitfall: handling only odd centres. `"aa"` has 3 palindromes, not 2.
- Follow-up: Manacher's algorithm gives O(n); the count is the sum of `ceil(radius)` over all centres.
