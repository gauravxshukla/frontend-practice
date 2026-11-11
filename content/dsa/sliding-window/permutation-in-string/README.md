---
title: Permutation in String
type: dsa
difficulty: medium
topic: sliding-window
order: 4
neetcode: true
tags: [strings, sliding-window, counting, hash-map]
estimatedMinutes: 20
---

You get two lowercase strings, `s1` and `s2`. Return `true` if some **contiguous** substring of `s2` is a rearrangement of `s1` (same letters, same counts). Otherwise return `false`.

```js
function checkInclusion(s1, s2) // → boolean
```

## Examples

```text
Input:  s1 = "abc", s2 = "lecabee"
Output: true
Explanation: "cab" (indexes 2 to 4) is a rearrangement of "abc".

Input:  s1 = "abc", s2 = "lecaabee"
Output: false
```

## Constraints

- 1 ≤ `s1.length`, `s2.length` ≤ 10⁴
- Both strings contain lowercase English letters.

## Notes

- **Identify:** does s2 contain an anagram of s1 → fixed-size sliding window of letter counts
- **Brute force:** sort every s1-length substring of s2 and compare, O(n·m log m)
- **Better:** recount each window's 26 letters and compare arrays, O(26·n)
- **Insight:** instead of recounting, slide: add the entering char, remove the leaving one, track matching letters
- **Steps:** count s1; slide a len(s1) window over s2; keep "matches" of the 26 counts; 26 matches → true
- **Complexity:** O(n·m log m) → O(n) time, O(26) space
- **Pitfall:** if s1 is longer than s2 return false before building the first window
- **Related:** Valid Anagram, Minimum Window Substring, Longest Substring Without Repeating Characters
