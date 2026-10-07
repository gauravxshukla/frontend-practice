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

- **Backtracking with counts:** build the string one character at a time, tracking `open` and `close` used so far.
  - You may add `(` while `open < n`.
  - You may add `)` while `close < open`, so you never close something that isn't open.
  - When the length reaches `2n`, record the string.
- These two rules only ever produce valid strings, so there's no filtering and no wasted work.
- The number of results is the n-th Catalan number, about 4ⁿ / (n^1.5 · √π). Time is O(4ⁿ / √n) overall, and recursion depth is O(n).
- **Baseline:** generate all 2²ⁿ strings and keep the balanced ones. Correct, but it does far more work.
- Pitfall: building strings with `s + '('` in each call is fine. If you use a shared array for the path, remember to `pop()` after recursing.
- Why it's in the stack section: the `close < open` rule is exactly a stack-depth check, a counter standing in for a stack.
- Follow-up: generate them in lexicographic order, or count them without generating them (Catalan DP).
