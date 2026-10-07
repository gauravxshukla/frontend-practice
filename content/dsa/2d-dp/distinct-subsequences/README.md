---
title: Distinct Subsequences
type: dsa
difficulty: hard
topic: 2d-dp
order: 8
neetcode: true
tags: [dynamic-programming, strings]
estimatedMinutes: 30
---

Return how many different ways you can pick characters from `s`, keeping their order, so that the picked characters spell exactly `t`. Two ways are different if they use a different set of **positions** in `s`.

```js
function numDistinct(s, t) // → number
```

## Examples

```text
Input:  s = "rabbbit", t = "rabbit"
Output: 3
Explanation: Any two of the three b's can be used, so there are 3 ways.

Input:  s = "babgbag", t = "bag"
Output: 5
```

## Constraints

- 1 ≤ `s.length`, `t.length` ≤ 1000
- Both strings contain only English letters
- The answer fits in a signed 32-bit integer

## Notes

- **Key insight:** look at the last character of `s`. It is either not used (skip it), or, if it equals the last character of `t`, used as that final character.
- **Recurrence:** `ways(i, 0) = 1` (the empty target), `ways(0, j > 0) = 0`, and `ways(i, j) = ways(i - 1, j) + [s[i-1] === t[j-1]] · ways(i - 1, j - 1)`.
- **2-D table:** O(|s| · |t|) time and space.
- **Space optimisation:** row `i` reads only row `i - 1`, at column `j` and `j - 1`. Sweeping `j` **downward** keeps `ways[j - 1]` from the previous row, so one array of length `|t| + 1` is enough. O(|s| · |t|) time, O(|t|) space.
- If `t` is longer than `s` the answer is 0. Bounding the inner loop by `min(i, |t|)` skips impossible states.
- **Brute force:** for every character of `s`, branch on use/skip and count complete matches. O(2^|s|).
- Pitfall: sweeping `j` upward reuses the same character of `s` for two positions of `t`.
- Pitfall: intermediate counts can exceed the final answer. In JavaScript they stay exact up to 2⁵³; in other languages use 64-bit or a modulus.
- Follow-up: count distinct subsequences of `s` itself (each distinct string once), which needs last-occurrence bookkeeping.
