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

- **Identify:** longest substring made uniform with at most k changes → sliding window with counts
- **Key formula:** window is valid while (window length − count of its most frequent char) ≤ k
- **Brute force:** check every substring's replacements needed, O(n²·26)
- **Insight:** keep the best max-frequency seen; the window only needs to grow when that max grows
- **Steps:** add s[r] and update maxFreq; while length − maxFreq > k, drop s[l] and move l; update best
- **Complexity:** O(n²) → O(n) time, O(26) space
- **Pitfall:** maxFreq never needs decreasing; a stale max can't produce a longer wrong answer
- **Related:** Longest Substring Without Repeating Characters, Permutation in String, Minimum Window Substring
