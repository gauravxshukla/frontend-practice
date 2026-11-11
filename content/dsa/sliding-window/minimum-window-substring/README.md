---
title: Minimum Window Substring
type: dsa
difficulty: hard
topic: sliding-window
order: 5
neetcode: true
tags: [strings, sliding-window, hash-map]
estimatedMinutes: 30
---

You get two strings, `s` and `t`. Return the **shortest contiguous substring** of `s` that contains every character of `t`, including duplicates (if `t` has two `a`'s, the window needs at least two `a`'s). Matching is case-sensitive.

If no such substring exists, return `""`. When an answer exists, the shortest one is unique.

```js
function minWindow(s, t) // → string
```

## Examples

```text
Input:  s = "OUZODYXAZV", t = "XYZ"
Output: "YXAZ"

Input:  s = "xyz", t = "xyz"
Output: "xyz"

Input:  s = "x", t = "xy"
Output: ""
Explanation: s has no "y".
```

## Constraints

- 1 ≤ `s.length`, `t.length` ≤ 10⁵
- `s` and `t` contain uppercase and lowercase English letters.

## Notes

- **Identify:** shortest substring of s containing every char of t (with counts) → variable window + counts
- **Brute force:** check every substring of s against t's counts, O(n²·m)
- **Insight:** grow right until the window covers t, then shrink left while it still covers t
- **Steps:** count t; extend r, tracking how many required chars are satisfied; when all are, record and shrink l
- **Complexity:** O(n²·m) → O(n + m) time, O(alphabet) space
- **Pitfall:** count duplicates in t ("aa" needs two a's), and return "" when no window exists
- **Related:** Permutation in String, Longest Substring Without Repeating Characters, Sliding Window Maximum
