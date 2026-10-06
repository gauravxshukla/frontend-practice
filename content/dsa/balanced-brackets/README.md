---
title: Balanced Brackets
type: dsa
difficulty: easy
tags: [stack, strings, blind75]
estimatedMinutes: 10
---

Given a string containing only `()[]{}`, return `true` if every opening bracket is closed by the same type of bracket, in the correct order.

```js
isBalanced('([]{})'); // true
isBalanced('([)]');   // false
isBalanced('((');     // false
isBalanced('');       // true
```

## Notes

- Stack: push openers. On a closer, the top of the stack must be its matching opener, otherwise fail.
- A `{ ')': '(', ']': '[', '}': '{' }` lookup replaces the if/else chain.
- Return `false` early on a mismatch. At the end, the stack must be empty.
- O(n) time, O(n) space.
