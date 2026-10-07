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

- **Key insight:** every palindrome has a centre, either a single character (odd length) or the gap between two characters (even length). There are only `2n - 1` centres.
- **Expand around centre:** from each centre, move `left` and `right` outward while the characters match, and keep the longest window seen. O(n²) time, O(1) extra space.
- **DP formulation:** `pal[i][j]` is true when `s[i] === s[j]` and (`j - i < 2` or `pal[i + 1][j - 1]`). Fill by increasing length (or `i` from right to left). O(n²) time and O(n²) space.
- **Space optimisation of the DP:** row `i` only reads row `i + 1`, so one boolean array of length `n` updated with `j` from right to left gives O(n) space. Expand-around-centre gets to O(1) more simply.
- **Brute force:** check every substring for being a palindrome. O(n³).
- Pitfall: forgetting even-length centres (`"cbbd"` → `"bb"`).
- Pitfall: off-by-one when converting the final `left`/`right` back to a slice. After the loop the window is `left + 1 .. right - 1`.
- Follow-up: Manacher's algorithm finds the answer in O(n) by reusing mirror information around the rightmost palindrome found so far.
- Follow-up: "Palindromic Substrings" counts all of them with the same centre expansion.
