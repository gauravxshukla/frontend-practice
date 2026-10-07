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

- **Key insight:** any match is a window of length exactly `s1.length`. Slide a fixed-size window over `s2` and compare letter counts.
- **Simple sliding window:** keep 26-slot counts for `s1` and for the current window. Each step adds one letter and removes one, then compares the 26 slots. That's O(26 · n), which is effectively linear.
- **Matches counter (optimal):** track how many of the 26 letters currently have equal counts. Each add/remove changes at most one letter's equality, so it updates in O(1). Return `true` when matches hits 26. O(n) time and O(1) space.
- **Baseline:** sort each window and compare it with sorted `s1`. O(n · m log m).
- Pitfall: if `s1` is longer than `s2`, return `false` right away. Don't index out of bounds building the first window.
- Pitfall: check the *last* window too. A loop that checks before sliding needs one final comparison after the loop.
- Follow-up: "Find All Anagrams in a String" returns every start index and uses the same window.
