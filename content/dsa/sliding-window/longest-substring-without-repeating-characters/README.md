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

- **Sliding window:** keep a window `[left, right]` with no repeats, and grow `right` one step at a time.
- **Jump version (optimal):** remember each character's last index. When `s[right]` was last seen at an index ≥ `left`, jump `left` to that index + 1. Then update the best length.
- O(n) time and O(min(n, alphabet)) space.
- **Set version:** keep a `Set` of the window's characters, and while `s[right]` is in it, delete `s[left]` and `left++`. It's also O(n), since each character enters and leaves once.
- **Baseline:** check every substring for uniqueness. O(n²) with an incremental set, O(n³) naively.
- Pitfall: in the jump version, never move `left` *backwards*. In `"abba"`, the last `a` was seen at 0, but `left` is already at 2. That's why you check `>= left`.
- Pitfall: the empty string returns 0, and a single space counts as a character.
- Follow-up: return the substring itself, or allow at most k distinct characters (a classic variant).
