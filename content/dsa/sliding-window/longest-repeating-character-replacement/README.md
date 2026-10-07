---
title: Longest Repeating Character Replacement
type: dsa
difficulty: medium
topic: sliding-window
order: 3
neetcode: true
tags: [strings, sliding-window, counting]
estimatedMinutes: 25
---

You get a string `s` of uppercase English letters and a number `k`. You may change up to `k` characters of `s` into any other uppercase letter. Return the length of the longest substring that can be made of a **single repeated letter** after those changes.

```js
function characterReplacement(s, k) // → number
```

## Examples

```text
Input:  s = "XYYX", k = 2
Output: 4
Explanation: change both X's to Y (or both Y's to X).

Input:  s = "AAABABB", k = 1
Output: 5
Explanation: change the B at index 3 to get "AAAAA".
```

## Constraints

- 1 ≤ `s.length` ≤ 10⁵
- 0 ≤ `k` ≤ `s.length`
- `s` contains only uppercase English letters.

## Notes

- **Key insight:** a window is fixable when `windowLength − (count of its most common letter) ≤ k`. You keep the majority letter and replace the rest.
- **Sliding window:** grow `right`, update that letter's count and `maxFreq`. While the window needs more than k replacements, shrink from the left. Track the best window length.
- O(n) time (O(26n) if you recompute the max each step) and O(26) space.
- **The "stale maxFreq" trick:** you never need to decrease `maxFreq` when shrinking. The answer only improves when a *larger* `maxFreq` appears, so a stale (too high) value just stops the window from growing, it never produces a wrong answer.
- **Baseline:** check every substring with a running count. O(26 · n²).
- Pitfall: using `if` vs `while` to shrink. With the stale-max trick, a single `if` also works because the window never needs to shrink by more than one. `while` is easier to reason about.
- Pitfall: `k = 0` reduces to "longest run of one letter".
- Follow-up: the binary version, "Max Consecutive Ones III" (flip up to k zeros), uses the same window.
