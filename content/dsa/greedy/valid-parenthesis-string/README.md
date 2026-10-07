---
title: Valid Parenthesis String
type: dsa
difficulty: medium
topic: greedy
order: 8
neetcode: true
tags: [strings, greedy, stack, dynamic-programming]
estimatedMinutes: 20
---

You get a string `s` containing only `'('`, `')'` and `'*'`. Each `'*'` is a wildcard that you may treat as `'('`, as `')'`, or as nothing at all.

Return `true` if some choice for the wildcards makes `s` a balanced parentheses string (every `'('` closed by a later `')'`, and no `')'` without a matching earlier `'('`). The empty string counts as balanced.

```js
function checkValidString(s) // → boolean
```

## Examples

```text
Input:  s = "()"
Output: true

Input:  s = "(*)"
Output: true

Input:  s = "(*))"
Output: true
Explanation: Treat * as ( to get (()).
```

## Constraints

- 1 ≤ `s.length` ≤ 100
- `s[i]` is `(`, `)` or `*`

## Notes

- **Key insight:** you don't need to fix each `*`. Track the **range** of possible open-bracket counts `[lo, hi]`.
- `(`: `lo++`, `hi++`. `)`: `lo--`, `hi--`. `*`: `lo--` (treat as `)`), `hi++` (treat as `(`).
- If `hi < 0`, even treating every `*` as `(` can't save a `)`, so return `false`. Clamp `lo = max(lo, 0)`, since a negative count is never a real option.
- At the end, valid iff `lo === 0` (zero opens is reachable).
- O(n) time, O(1) space.
- Brute force: try all 3^k wildcard choices. A memoised DP over (index, open count) is O(n²) and is a good stepping stone.
- Alternative O(n): two stacks of indices, one for `(` and one for `*`. Match `)` with `(` first, then `*`. At the end, each leftover `(` needs a `*` with a larger index.
- Pitfall: without the clamp, `lo` can dip below 0 and a later `(` brings it back to 0, wrongly accepting strings like `"(*)("`.
