---
title: Longest Substring Without Repeating Characters
type: dsa
difficulty: medium
topic: sliding-window
order: 2
neetcode: true
tags: [strings, sliding-window, hash-map]
estimatedMinutes: 20
---

You get a string `s`. Return the length of the longest **contiguous** substring in which no character appears more than once.

```js
function lengthOfLongestSubstring(s) // → number
```

## Examples

```text
Input:  s = "zxyzxyz"
Output: 3
Explanation: "zxy", "xyz", and others have length 3.

Input:  s = "xxxx"
Output: 1

Input:  s = "pwwkew"
Output: 3
Explanation: "wke". Note that "pwke" is not contiguous.
```

## Constraints

- 0 ≤ `s.length` ≤ 5 · 10⁴
- `s` may contain letters, digits, symbols, and spaces.

## Notes

- **Identify:** longest contiguous substring with all-distinct characters → variable sliding window
- **Brute force:** check every substring for repeats, O(n³) (O(n²) with a set per start)
- **Better:** window + set, shrinking one char at a time on a repeat, O(n) but up to 2n steps
- **Insight:** instead of shrinking step by step, jump the left edge past the repeat's last index
- **Steps:** for each r, if s[r] was seen inside the window, set l = lastIndex + 1; record r; update best
- **Complexity:** O(n³) → O(n) time, O(min(n, alphabet)) space
- **Pitfall:** only jump when the last index is inside the window ("abba"), never move l backwards
- **Related:** Longest Repeating Character Replacement, Permutation in String, Minimum Window Substring
