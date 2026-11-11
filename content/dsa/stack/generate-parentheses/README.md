---
title: Generate Parentheses
type: dsa
difficulty: medium
topic: stack
order: 4
neetcode: true
tags: [backtracking, recursion, strings, stack]
estimatedMinutes: 20
---

You get a number `n`. Return every string made of `n` pairs of parentheses that is **well-formed**: each `(` is closed by a later `)`, and no prefix ever has more `)` than `(`. The strings can be returned in any order.

```js
function generateParenthesis(n) // → string[]
```

## Examples

```text
Input:  n = 1
Output: ["()"]

Input:  n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
```

## Constraints

- 1 ≤ `n` ≤ 8

## Notes

- **Identify:** all well-formed strings of n pairs → backtracking with open/close counts
- **Brute force:** generate all 2^(2n) strings of ( and ), keep the valid ones, O(2^(2n)·n)
- **Insight:** never build an invalid prefix: add "(" while open < n, add ")" only while close < open
- **Steps:** recurse with the current string; branch on "(" and ")" under those two rules; save at length 2n
- **Complexity:** O(2^(2n)·n) → O(4^n / √n) time (Catalan count), O(n) recursion depth
- **Pitfall:** adding ")" when close == open creates a prefix that can never be fixed
- **Related:** Valid Parentheses, Subsets, Letter Combinations of a Phone Number
