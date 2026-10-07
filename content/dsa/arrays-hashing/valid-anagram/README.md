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

- **Key insight:** two strings are anagrams exactly when their character counts match.
- **Optimal:** return `false` early if the lengths differ. Then walk both strings together, incrementing a count for `s[i]` and decrementing it for `t[i]`. Every count must end at zero.
- O(n) time. The extra space is O(k) for k distinct characters, which is O(1) (26 slots) for lowercase letters.
- **Baseline:** sort both strings and compare them. That is O(n log n) and simple, which is a fine first answer.
- Pitfall: skipping the length check. `"ab"` vs `"a"` would then only fail if you remember to check leftover counts.
- Pitfall: comparing two count objects with `===`, which checks identity, not contents.
- Follow-up: for full Unicode input, iterate with `for...of` (code points) and a `Map` instead of a fixed 26-slot array.
