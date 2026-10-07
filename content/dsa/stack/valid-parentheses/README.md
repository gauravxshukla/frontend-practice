---
title: Valid Parentheses
type: dsa
difficulty: easy
topic: stack
order: 1
neetcode: true
tags: [stack, strings]
estimatedMinutes: 10
---

Given a string containing only `()[]{}`, return `true` if every opening bracket is closed by the same type of bracket, in the correct order.

```js
isValid('([]{})'); // true
isValid('([)]');   // false
isValid('((');     // false
isValid('');       // true
```

## Notes

- Stack: push openers. On a closer, the top of the stack must be its matching opener, otherwise fail.
- A `{ ')': '(', ']': '[', '}': '{' }` lookup replaces the if/else chain.
- Return `false` early on a mismatch. At the end, the stack must be empty.
- O(n) time, O(n) space.
