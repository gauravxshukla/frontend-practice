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

- **Identify:** parentheses with wildcards "*" (open, close or empty) → track the range of possible open counts
- **Brute force:** try all three meanings of every "*", O(3^k · n)
- **Better:** DP over (index, open count), O(n²)
- **Insight:** instead of tracking each choice, track lo and hi, the fewest and most open brackets possible
- **Steps:** "(" → lo++, hi++; ")" → lo−−, hi−−; "*" → lo−−, hi++; if hi < 0 return false; clamp lo at 0; end: lo == 0
- **Complexity:** O(3^k · n) → O(n) time, O(1) space
- **Pitfall:** clamp lo at 0 (you can't have negative opens), but hi < 0 means too many ")" for sure
- **Related:** Valid Parentheses, Generate Parentheses, Jump Game
