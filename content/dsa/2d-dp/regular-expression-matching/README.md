---
title: Regular Expression Matching
type: dsa
difficulty: hard
topic: 2d-dp
order: 11
neetcode: true
tags: [dynamic-programming, strings, recursion]
estimatedMinutes: 40
---

Implement a tiny regular-expression matcher. The pattern `p` contains lowercase letters plus two special characters:

- `.` matches any single character.
- `*` matches **zero or more** copies of the character right before it (which may be `.`).

Return `true` only if the pattern matches the **entire** string `s`, not just part of it.

```js
function isMatch(s, p) // → boolean
```

## Examples

```text
Input:  s = "aa", p = "a"
Output: false
Explanation: The pattern covers only one character.

Input:  s = "aa", p = "a*"
Output: true
Explanation: "a*" repeats "a" twice.

Input:  s = "ab", p = ".*"
Output: true
Explanation: ".*" matches any string.
```

## Constraints

- 1 ≤ `s.length` ≤ 20, 1 ≤ `p.length` ≤ 20
- `s` contains only lowercase letters; `p` contains lowercase letters, `.` and `*`
- Every `*` has a valid (non-`*`) character before it

## Notes

- **Key insight:** treat `x*` as one unit. At any point it can match nothing (skip the two pattern characters) or eat one matching character of `s` and stay on the same unit.
- **Recurrence:** with `match(i, j)` = `s[i..]` matched by `p[j..]` and `first = i < m && (p[j] === s[i] || p[j] === '.')`:
  - if `p[j + 1] === '*'`: `match(i, j) = match(i, j + 2) || (first && match(i + 1, j))`
  - else: `match(i, j) = first && match(i + 1, j + 1)`
  - base: `match(m, n) = true`, `match(i < m, n) = false`. Note that `i = m` with pattern left can still be true (`"a*b*"` matches `""`).
- **Bottom-up table:** fill `i` from `m` down to 0 and `j` from `n - 1` down. O(m · n) time and space.
- **Space optimisation:** row `i` reads only rows `i` and `i + 1`, so two rows of length `n + 1` give O(n) space.
- **Brute force:** the same recursion with plain backtracking. Exponential on patterns like `"a*a*a*a*c"` against `"aaaaaaaaab"`. Memoising `(i, j)` brings it to O(m · n).
- Pitfall: checking `p[j] === '*'` at the current position instead of looking one ahead at `p[j + 1]`.
- Pitfall: only handling `i < m`. The empty remaining string must still be tested against `x*` units.
- Follow-up: Wildcard Matching (`?` and a standalone `*` for any run of characters) uses the same table with a different transition.
