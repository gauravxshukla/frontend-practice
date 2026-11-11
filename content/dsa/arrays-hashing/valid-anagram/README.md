---
title: Valid Anagram
type: dsa
difficulty: easy
topic: arrays-hashing
order: 2
neetcode: true
tags: [strings, hash-map, counting, sorting]
estimatedMinutes: 10
---

You get two strings, `s` and `t`. Return `true` if `t` uses exactly the same characters as `s`, each the same number of times, just possibly rearranged. Otherwise return `false`.

```js
function isAnagram(s, t) // → boolean
```

## Examples

```text
Input:  s = "anagram", t = "nagaram"
Output: true

Input:  s = "rat", t = "car"
Output: false
Explanation: "car" has a "c" where "rat" has a "t".
```

## Constraints

- 1 ≤ `s.length`, `t.length` ≤ 5 · 10⁴
- Both strings contain lowercase English letters.

## Notes

- **Identify:** same letters with the same counts, any order → frequency count
- **Brute force:** sort both strings and compare, O(n log n)
- **Insight:** instead of sorting, count up for `s` and down for `t`; all zeros means anagram
- **Steps:** different lengths → false; tally +1 per char of s, −1 per char of t; every count must be 0
- **Complexity:** O(n log n) → O(n) time, O(1) space (26 counters)
- **Pitfall:** the 26-slot array assumes lowercase a–z; Unicode input needs a hash map
- **Related:** Group Anagrams, Permutation in String, Contains Duplicate
