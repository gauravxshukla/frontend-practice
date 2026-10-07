---
title: Interleaving String
type: dsa
difficulty: medium
topic: 2d-dp
order: 6
neetcode: true
tags: [dynamic-programming, strings]
estimatedMinutes: 30
---

Return `true` if `s3` can be formed by **interleaving** `s1` and `s2`: walk through `s3` taking each character from either `s1` or `s2`, so that every character of both is used exactly once and each string's own order is kept. The pieces may alternate in any pattern.

```js
function isInterleave(s1, s2, s3) // → boolean
```

## Examples

```text
Input:  s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"
Output: true
Explanation: "aa" + "dbbc" + "bc" + "a" + "c", alternating between s1 and s2.

Input:  s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"
Output: false

Input:  s1 = "", s2 = "", s3 = ""
Output: true
```

## Constraints

- 0 ≤ `s1.length`, `s2.length` ≤ 100
- 0 ≤ `s3.length` ≤ 200
- All strings are lowercase English letters

## Notes

- **Key insight:** after using `i` characters of `s1` and `j` of `s2`, the next character of `s3` is `s3[i + j]`. The state is just `(i, j)`, so the problem is a grid walk where each step moves right or down.
- First check `s1.length + s2.length === s3.length`. If not, return `false` immediately.
- **Recurrence:** `ok(0, 0) = true`; `ok(i, j) = (ok(i - 1, j) && s1[i-1] === s3[i+j-1]) || (ok(i, j - 1) && s2[j-1] === s3[i+j-1])`.
- **2-D table:** O(m · n) time and space.
- **Space optimisation:** row `i` reads the cell above (still in the array from the previous row) and the cell to the left (already updated), so one boolean array of length `n + 1` works. O(m · n) time, O(n) space (O(min(m, n)) if you swap so the shorter string is on the inner loop).
- **Brute force:** recursion that tries taking the next character from `s1` or `s2`. Exponential when both strings share long runs (e.g. `"aaaa…"`). Memoising on `(i, j)` gives the same O(m · n).
- Pitfall: a greedy two-pointer that prefers `s1` whenever it matches fails on `s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"`.
- Edge cases: empty strings (`"", "", ""` → true), and one string empty so `s3` must equal the other.
- Follow-up: return one valid interleaving pattern by backtracking through the table.
