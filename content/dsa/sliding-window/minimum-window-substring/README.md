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

- **Variable sliding window:** expand `right` until the window covers `t`, then shrink `left` as far as it stays valid, recording the smallest window seen. Repeat.
- **Bookkeeping:** a `need` map from char to how many more are required, plus a single `missing` counter (initially `t.length`). Adding `ch` with `need[ch] > 0` decrements `missing`. Removing `ch` that pushes `need[ch]` above 0 increments it. The window is valid exactly when `missing === 0`.
- Surplus copies make `need[ch]` negative, which is how you know they can be dropped for free.
- O(|s| + |t|) time and O(alphabet) space.
- **Baseline:** check every substring for coverage, O(|s|² · alphabet).
- Pitfall: comparing two full count maps on every step works but costs O(52) per step and is easy to get wrong with duplicates.
- Pitfall: storing the best *substring* on every improvement copies strings. Store `start` and `length` and slice once at the end.
- Pitfall: `t` longer than `s` means there's no answer.
- Follow-up: if `s` is huge and `t` small, pre-filter `s` to only the positions whose character is in `t` and slide over that list.
